// filepath: c:\Users\pc\OneDrive\Masaüstü\TaxCalculator\src\main\java\com\eren\taxcalculator\controller\AdminController.java
package com.eren.taxcalculator.controller;

import com.eren.taxcalculator.dto.AdminDashboardResponse;
import com.eren.taxcalculator.dto.ProductResponse;
import com.eren.taxcalculator.dto.UserWithProductsResponse;
import com.eren.taxcalculator.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        AdminDashboardResponse dashboard = adminService.getDashboardStats();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserWithProductsResponse>> getAllUsersWithProducts() {
        List<UserWithProductsResponse> users = adminService.getAllUsersWithProducts();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductResponse>> getUserProducts(@PathVariable String userId) {
        List<ProductResponse> products = adminService.getUserProducts(userId);
        return ResponseEntity.ok(products);
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok().body("{\"message\": \"Kullanıcı başarıyla silindi\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}