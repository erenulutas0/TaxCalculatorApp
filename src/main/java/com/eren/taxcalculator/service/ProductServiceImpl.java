package com.eren.taxcalculator.service;

import com.eren.taxcalculator.dto.*;
import com.eren.taxcalculator.exception.ResourceNotFoundException;
import com.eren.taxcalculator.exception.UnauthorizedOperationException;
import com.eren.taxcalculator.model.Product;
import com.eren.taxcalculator.model.ProductType;
import com.eren.taxcalculator.model.User;
import com.eren.taxcalculator.repository.ProductRepository;
import com.eren.taxcalculator.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Product product = new Product();
        product.setName(request.getName());
        product.setType(request.getType());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setUserId(user.getId());

        Product savedProduct = productRepository.save(product);
        logger.info("Product created successfully: {} by user: {}", savedProduct.getName(), username);

        return convertToProductResponse(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getUserProducts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<Product> products = productRepository.findByUserId(user.getId());

        return products.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(String id, ProductUpdateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Kullanıcının ürününü kontrol et
        if (!product.getUserId().equals(user.getId())) {
            throw new UnauthorizedOperationException("You can only update your own products");
        }

        // Güncelleme işlemi
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getType() != null) {
            product.setType(request.getType());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getTaxPaid() != null) { // ✅ Yeni kontrol
            product.setTaxPaid(request.getTaxPaid());
        }

        Product updatedProduct = productRepository.save(product);
        return convertToProductResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(String id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Kullanıcının ürününü kontrol et
        if (!product.getUserId().equals(user.getId())) {
            throw new UnauthorizedOperationException("You can only delete your own products");
        }

        productRepository.delete(product);
        logger.info("Product deleted successfully: {} by user: {}", id, username);
    }

    @Override
    @Transactional(readOnly = true)
    public TaxCalculationResponse calculateUserTotalTax(String username) {
        List<ProductResponse> products = getUserProducts(username);

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (ProductResponse product : products) {
            totalValue = totalValue.add(product.getPrice());
            totalTax = totalTax.add(product.getTaxAmount());
        }

        return new TaxCalculationResponse(
                products.size(),
                totalValue,
                totalTax,
                totalValue.add(totalTax)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ProductSummaryResponse getUserProductSummary(String username) {
        List<ProductResponse> products = getUserProducts(username);

        Map<String, Integer> productsByType = products.stream()
                .collect(Collectors.groupingBy(
                        product -> product.getType().toString(),
                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)
                ));

        BigDecimal totalValue = products.stream()
                .map(ProductResponse::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTax = products.stream()
                .map(ProductResponse::getTaxAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ProductSummaryResponse(
                products.size(),
                totalValue,
                totalTax,
                productsByType
        );
    }

    @Override
    @Transactional
    public ProductResponse payTax(String id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Kullanıcının ürününü kontrol et
        if (!product.getUserId().equals(user.getId())) {
            throw new UnauthorizedOperationException("You can only pay tax for your own products");
        }

        // Vergiyi ödendi olarak işaretle
        product.setTaxPaid(true);
        if (product.getTaxDueDate() != null) { // Null check ekleyin
            product.setTaxDueDate(null);
        }

        Product updatedProduct = productRepository.save(product);
        logger.info("Tax paid for product: {} by user: {}", id, username);

        return convertToProductResponse(updatedProduct);
    }

    private ProductResponse convertToProductResponse(Product product) {
        BigDecimal taxAmount = calculateTaxForProduct(product);

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setType(product.getType());
        response.setPrice(product.getPrice());
        response.setPurchaseDate(product.getPurchaseDate());
        response.setDescription(product.getDescription());
        response.setTaxAmount(taxAmount);
        response.setTax(taxAmount);
        response.setTaxPaid(product.isTaxPaid());
        response.setUserId(product.getUserId());
        response.setOwnerId(product.getUserId()); // Aynı değer
        response.setTaxDueDate(product.getTaxDueDate());

        return response;
    }

    private BigDecimal calculateTaxForProduct(Product product) {
        BigDecimal price = product.getPrice();
        ProductType type = product.getType();
        BigDecimal taxRate;

        switch (type) {
            case CAR:
                taxRate = new BigDecimal("0.02"); // %2
                break;
            case COMMERCIAL:
                taxRate = new BigDecimal("0.03"); // %3
                break;
            case HOUSE:
            case LAND:
                taxRate = new BigDecimal("0.001"); // %0.1
                break;
            case STORE:
                taxRate = new BigDecimal("0.002"); // %0.2
                break;
            case ELECTRONICS:
                taxRate = new BigDecimal("0.18"); // %18
                break;
            case JEWELRY:
                taxRate = new BigDecimal("0.20"); // %20
                break;
            case BOAT:
                taxRate = new BigDecimal("0.05"); // %5
                break;
            default:
                taxRate = new BigDecimal("0.01"); // %1
                break;
        }
        return price.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
    }
}