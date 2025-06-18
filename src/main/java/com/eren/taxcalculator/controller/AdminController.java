// filepath: c:\Users\pc\OneDrive\Masaüstü\TaxCalculator\src\main\java\com\eren\taxcalculator\controller\AdminController.java
package com.eren.taxcalculator.controller;

import com.eren.taxcalculator.dto.AdminDashboardResponse;
import com.eren.taxcalculator.dto.ProductResponse;
import com.eren.taxcalculator.dto.UserWithProductsResponse;
import com.eren.taxcalculator.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        try {
            AdminDashboardResponse dashboard = adminService.getDashboardStats();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            logger.error("Error getting dashboard stats: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        try {
            AdminDashboardResponse dashboard = adminService.getDashboardStats();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            logger.error("Error getting dashboard: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserWithProductsResponse>> getAllUsersWithProducts() {
        try {
            List<UserWithProductsResponse> users = adminService.getAllUsersWithProducts();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error getting users: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/users/{userId}/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductResponse>> getUserProducts(@PathVariable String userId) {
        try {
            List<ProductResponse> products = adminService.getUserProducts(userId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error getting user products for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String userId) {
        try {
            adminService.deleteUser(userId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            response.put("userId", userId);

            logger.info("User deleted successfully via API: {}", userId);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            logger.error("Runtime error deleting user via API {}: {}", userId, e.getMessage());

            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("userId", userId);

            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            logger.error("Unexpected error deleting user via API {}: {}", userId, e.getMessage(), e);

            Map<String, String> response = new HashMap<>();
            response.put("error", "An unexpected error occurred");
            response.put("userId", userId);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}