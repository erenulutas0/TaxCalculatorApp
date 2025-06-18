package com.eren.taxcalculator.service;

import com.eren.taxcalculator.dto.AdminDashboardResponse;
import com.eren.taxcalculator.dto.ProductResponse;
import com.eren.taxcalculator.dto.UserWithProductsResponse;

import java.util.List;

public interface AdminService {
    AdminDashboardResponse getDashboardStats();
    List<UserWithProductsResponse> getAllUsersWithProducts();
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getUserProducts(String userId);
    void deleteUser(String userId);
}