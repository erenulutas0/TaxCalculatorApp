package com.eren.taxcalculator.service;

import com.eren.taxcalculator.dto.*;
import com.eren.taxcalculator.model.Product;
import com.eren.taxcalculator.model.User;
import com.eren.taxcalculator.repository.ProductRepository;
import com.eren.taxcalculator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.eren.taxcalculator.model.RoleName;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<UserWithProductsResponse> getAllUsersWithProducts() {
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
                    .map(this::calculateTax)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal paidTax = products.stream()
                    .filter(Product::isTaxPaid)
                    .map(this::calculateTax)
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

        return result;
    }

    @Override
    public AdminDashboardResponse getDashboardStats() {
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
                .map(this::calculateTax)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaidTax = allProducts.stream()
                .filter(Product::isTaxPaid)
                .map(this::calculateTax)
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

        return response;
    }

    @Override
    public List<ProductResponse> getUserProducts(String userId) {
        List<Product> products = productRepository.findByUserId(userId);

        return products.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
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
        response.setTax(calculateTax(product));
        response.setUserId(product.getUserId());
        response.setDescription(product.getDescription()); // Bu satırı ekleyin
        response.setTaxAmount(calculateTax(product));       // Bu satırı ekleyin

        return response;
    }

    // Tek calculateTax metodu kullan
    private BigDecimal calculateTax(Product product) {
        // Tax calculation logic
        return product.getPrice().multiply(new BigDecimal("0.18")); // %18 vergi
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
                .anyMatch(role -> role.getName().equals(RoleName.ADMIN));

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