package com.eren.taxcalculator.dto;

import java.math.BigDecimal;
import java.util.Map;

public class ProductSummaryResponse {
    private int totalProducts;
    private BigDecimal totalValue;
    private BigDecimal totalTax;
    private Map<String, Integer> productsByType;

    public ProductSummaryResponse(int totalProducts, BigDecimal totalValue, BigDecimal totalTax, Map<String, Integer> productsByType) {
        this.totalProducts = totalProducts;
        this.totalValue = totalValue;
        this.totalTax = totalTax;
        this.productsByType = productsByType;
    }

    // Getters and Setters
    public int getTotalProducts() { return totalProducts; }
    public void setTotalProducts(int totalProducts) { this.totalProducts = totalProducts; }

    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

    public BigDecimal getTotalTax() { return totalTax; }
    public void setTotalTax(BigDecimal totalTax) { this.totalTax = totalTax; }

    public Map<String, Integer> getProductsByType() { return productsByType; }
    public void setProductsByType(Map<String, Integer> productsByType) { this.productsByType = productsByType; }
}