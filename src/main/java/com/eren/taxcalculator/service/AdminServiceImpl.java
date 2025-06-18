package com.eren.taxcalculator.service;

import com.eren.taxcalculator.dto.*;
import com.eren.taxcalculator.model.Product;
import com.eren.taxcalculator.model.ProductType;
import com.eren.taxcalculator.model.User;
import com.eren.taxcalculator.model.RoleName;
import com.eren.taxcalculator.repository.ProductRepository;
import com.eren.taxcalculator.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserWithProductsResponse> getAllUsersWithProducts() {
        try {
            // Sadece USER rolüne sahip kullanıcıları getir
            List<User> allUsers = userRepository.findAll();

            // Admin rolüne sahip kullanıcıları filtrele
            List<User> userRoleOnly = allUsers.stream()
                    .filter(user -> user.getRoles().stream()
                            .noneMatch(role -> role.getName().equals(RoleName.ADMIN)))
                    .collect(Collectors.toList());

            List<UserWithProductsResponse> result = new ArrayList<>();

            for (User user : userRoleOnly) {
                List<Product> products = productRepository.findByUserId(user.getId());

                BigDecimal totalValue = products.stream()
                        .map(Product::getPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalTax = products.stream()
                        .map(this::calculateTaxForProduct)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal paidTax = products.stream()
                        .filter(Product::isTaxPaid)
                        .map(this::calculateTaxForProduct)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal unpaidTax = totalTax.subtract(paidTax);

                long paidTaxCount = products.stream()
                        .filter(Product::isTaxPaid)
                        .count();

                long unpaidTaxCount = products.size() - paidTaxCount;

                UserWithProductsResponse response = new UserWithProductsResponse();
                response.setId(user.getId());
                response.setUsername(user.getUsername());
                response.setEmail(user.getEmail());
                response.setProductCount(products.size());
                response.setTotalValue(totalValue);
                response.setTotalTax(totalTax);
                response.setPaidTax(paidTax);
                response.setUnpaidTax(unpaidTax);
                response.setPaidTaxCount(paidTaxCount);
                response.setUnpaidTaxCount(unpaidTaxCount);

                result.add(response);
            }

            logger.info("Successfully retrieved {} users with products", result.size());
            return result;

        } catch (Exception e) {
            logger.error("Error retrieving users with products: {}", e.getMessage(), e);
            throw new RuntimeException("Kullanıcılar getirilemedi: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        try {
            // Sadece USER rolüne sahip kullanıcıları say
            List<User> allUsers = userRepository.findAll();
            long totalUsers = allUsers.stream()
                    .filter(user -> user.getRoles().stream()
                            .noneMatch(role -> role.getName().equals(RoleName.ADMIN)))
                    .count();

            // Tüm ürünleri al
            List<Product> allProducts = productRepository.findAll();

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

            AdminDashboardResponse response = new AdminDashboardResponse();
            response.setTotalUsers(totalUsers);
            response.setTotalProducts(totalProducts);
            response.setTotalValue(totalValue);
            response.setTotalTax(totalTax);
            response.setTotalPaidTax(totalPaidTax);
            response.setTotalUnpaidTax(totalUnpaidTax);
            response.setPaidTaxProducts(paidTaxProducts);
            response.setUnpaidTaxProducts(totalProducts - paidTaxProducts);

            logger.info("Dashboard stats calculated successfully");
            return response;

        } catch (Exception e) {
            logger.error("Error calculating dashboard stats: {}", e.getMessage(), e);
            throw new RuntimeException("Dashboard istatistikleri hesaplanamadı: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getUserProducts(String userId) {
        try {
            List<Product> products = productRepository.findByUserId(userId);

            List<ProductResponse> result = products.stream()
                    .map(this::convertToProductResponse)
                    .collect(Collectors.toList());

            logger.info("Retrieved {} products for user: {}", result.size(), userId);
            return result;

        } catch (Exception e) {
            logger.error("Error retrieving products for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Kullanıcı ürünleri getirilemedi: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        try {
            List<Product> products = productRepository.findAll();

            List<ProductResponse> result = products.stream()
                    .map(this::convertToProductResponse)
                    .collect(Collectors.toList());

            logger.info("Retrieved all {} products", result.size());
            return result;

        } catch (Exception e) {
            logger.error("Error retrieving all products: {}", e.getMessage(), e);
            throw new RuntimeException("Tüm ürünler getirilemedi: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteUser(String userId) {
        try {
            // Kullanıcının var olup olmadığını kontrol et
            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                logger.warn("User not found for deletion: {}", userId);
                throw new RuntimeException("Kullanıcı bulunamadı");
            }

            User user = userOptional.get();
            logger.info("Attempting to delete user: {} ({})", user.getUsername(), userId);

            // Admin kullanıcısının silinmesini engelle
            boolean isAdmin = user.getRoles().stream()
                    .anyMatch(role -> role.getName().equals(RoleName.ADMIN));

            if (isAdmin) {
                logger.warn("Attempted to delete admin user: {}", user.getUsername());
                throw new RuntimeException("Admin kullanıcıları silinemez");
            }

            // Önce kullanıcının tüm ürünlerini sil
            List<Product> userProducts = productRepository.findByUserId(userId);
            if (!userProducts.isEmpty()) {
                logger.info("Deleting {} products for user: {}", userProducts.size(), user.getUsername());
                productRepository.deleteAll(userProducts);
            }

            // Sonra kullanıcıyı sil
            userRepository.deleteById(userId);
            logger.info("User deleted successfully: {} ({})", user.getUsername(), userId);

        } catch (RuntimeException e) {
            logger.error("Runtime error deleting user {}: {}", userId, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error deleting user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Kullanıcı silinirken hata oluştu: " + e.getMessage());
        }
    }

    // Helper metod - Product'ı ProductResponse'a çevir
    private ProductResponse convertToProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setType(product.getType());
        response.setPrice(product.getPrice());
        response.setPurchaseDate(product.getPurchaseDate());
        response.setTaxPaid(product.isTaxPaid());
        response.setTax(calculateTaxForProduct(product));
        response.setUserId(product.getUserId());
        response.setDescription(product.getDescription());
        response.setTaxAmount(calculateTaxForProduct(product));
        response.setTaxDueDate(product.getTaxDueDate());
        response.setOwnerId(product.getUserId());

        return response;
    }

    // Doğru vergi hesaplama metodu
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