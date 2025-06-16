package com.eren.taxcalculator.service;

import com.eren.taxcalculator.dto.*;
import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductCreateRequest request, String username);
    List<ProductResponse> getUserProducts(String username);
    ProductResponse updateProduct(String id, ProductUpdateRequest request, String username);
    void deleteProduct(String id, String username);
    TaxCalculationResponse calculateUserTotalTax(String username);
    ProductSummaryResponse getUserProductSummary(String username);
    ProductResponse payTax(String id, String username); // ✅ Yeni metod
}