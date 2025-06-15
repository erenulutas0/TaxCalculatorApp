        package com.eren.taxcalculator.dto;

import java.math.BigDecimal;

public class TaxCalculationResponse {
    private int totalProducts;
    private BigDecimal totalValue;
    private BigDecimal totalTax;
    private BigDecimal totalWithTax;

    public TaxCalculationResponse(int totalProducts, BigDecimal totalValue, BigDecimal totalTax, BigDecimal totalWithTax) {
        this.totalProducts = totalProducts;
        this.totalValue = totalValue;
        this.totalTax = totalTax;
        this.totalWithTax = totalWithTax;
    }

    // Getters and Setters
    public int getTotalProducts() { return totalProducts; }
    public void setTotalProducts(int totalProducts) { this.totalProducts = totalProducts; }

    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

    public BigDecimal getTotalTax() { return totalTax; }
    public void setTotalTax(BigDecimal totalTax) { this.totalTax = totalTax; }

    public BigDecimal getTotalWithTax() { return totalWithTax; }
    public void setTotalWithTax(BigDecimal totalWithTax) { this.totalWithTax = totalWithTax; }
}