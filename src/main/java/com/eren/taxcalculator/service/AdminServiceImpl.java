package com.eren.taxcalculator.service;

import com.eren.taxcalculator.dto.*;
import com.eren.taxcalculator.model.Product;
import com.eren.taxcalculator.model.User;
import com.eren.taxcalculator.repository.ProductRepository;
import com.eren.taxcalculator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Override
    public AdminDashboardResponse getDashboardStats() {
        // Tüm kullanıcıları al (admin hariç)
        List<User> allUsers = userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .noneMatch(role -> role.getName().name().equals("ROLE_ADMIN")))
                .collect(Collectors.toList());

        // Tüm ürünleri al
        List<Product> allProducts = productRepository.findAll();

        // İstatistikleri hesapla
        long totalUsers = allUsers.size();

        BigDecimal totalValue = allProducts.stream()
                .map(Product::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTax = allProducts.stream()
                .map(this::calculateTaxForProduct)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaidTax = allProducts.stream()
                .filter(Product::isTaxPaid)
                .map(this::calculateTaxForProduct)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalUnpaidTax = totalTax.subtract(totalPaidTax);

        long totalProducts = allProducts.size();
        long paidTaxProducts = allProducts.stream()
                .mapToLong(product -> product.isTaxPaid() ? 1 : 0)
                .sum();

        return new AdminDashboardResponse(
                totalUsers,
                totalProducts,
                totalValue,
                totalTax,
                totalPaidTax,
                totalUnpaidTax,
                paidTaxProducts,
                totalProducts - paidTaxProducts
        );
    }

    @Override
    public List<UserWithProductsResponse> getAllUsersWithProducts() {
        List<User> allUsers = userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .noneMatch(role -> role.getName().name().equals("ROLE_ADMIN")))
                .collect(Collectors.toList());

        return allUsers.stream()
                .map(this::convertToUserWithProductsResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getUserProducts(String userId) {
        List<Product> products = productRepository.findByUserId(userId);
        return products.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    private UserWithProductsResponse convertToUserWithProductsResponse(User user) {
        List<Product> userProducts = productRepository.findByUserId(user.getId());

        BigDecimal totalValue = userProducts.stream()
                .map(Product::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTax = userProducts.stream()
                .map(this::calculateTaxForProduct)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal paidTax = userProducts.stream()
                .filter(Product::isTaxPaid)
                .map(this::calculateTaxForProduct)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long productCount = userProducts.size();
        long paidTaxCount = userProducts.stream()
                .mapToLong(product -> product.isTaxPaid() ? 1 : 0)
                .sum();

        return new UserWithProductsResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                productCount,
                totalValue,
                totalTax,
                paidTax,
                totalTax.subtract(paidTax),
                paidTaxCount,
                productCount - paidTaxCount
        );
    }

    private ProductResponse convertToProductResponse(Product product) {
        BigDecimal taxAmount = calculateTaxForProduct(product);

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setType(product.getType());
        response.setPrice(product.getPrice());
        response.setDescription(product.getDescription());
        response.setTaxAmount(taxAmount);
        response.setTaxPaid(product.isTaxPaid());
        response.setOwnerId(product.getUserId());
        response.setTaxDueDate(product.getTaxDueDate());

        return response;
    }

    private BigDecimal calculateTaxForProduct(Product product) {
        switch (product.getType()) {
            case CAR:
                return product.getPrice().multiply(BigDecimal.valueOf(0.02));
            // Eğer COMMERCIAL yerine başka bir isim varsa onu kullanın
            // Örneğin: COMMERCIAL_VEHICLE, TRUCK, vb.
            case COMMERCIAL:  // Bu satırı mevcut enum değerinizle değiştirin
                return product.getPrice().multiply(BigDecimal.valueOf(0.03));
            case HOUSE:
            case LAND:
                return product.getPrice().multiply(BigDecimal.valueOf(0.001));
            case STORE:
                return product.getPrice().multiply(BigDecimal.valueOf(0.002));
            case ELECTRONICS:
                return product.getPrice().multiply(BigDecimal.valueOf(0.18));
            case JEWELRY:
                return product.getPrice().multiply(BigDecimal.valueOf(0.20));
            case BOAT:
                return product.getPrice().multiply(BigDecimal.valueOf(0.05));
            default:
                return BigDecimal.ZERO;
        }
    }

    @Override
    public void deleteUser(String userId) {
        // Kullanıcının var olup olmadığını kontrol et
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }

        User user = userOptional.get();

        // Admin kullanıcısının silinmesini engelle
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().name().equals("ROLE_ADMIN"));

        if (isAdmin) {
            throw new RuntimeException("Admin kullanıcıları silinemez");
        }

        try {
            // Önce kullanıcının tüm ürünlerini sil
            List<Product> userProducts = productRepository.findByUserId(userId);
            if (!userProducts.isEmpty()) {
                productRepository.deleteAll(userProducts);
            }

            // Sonra kullanıcıyı sil
            userRepository.deleteById(userId);
        } catch (Exception e) {
            throw new RuntimeException("Kullanıcı silinirken hata oluştu: " + e.getMessage());
        }
    }
}