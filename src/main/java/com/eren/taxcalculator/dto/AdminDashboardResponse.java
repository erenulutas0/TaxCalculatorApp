package com.eren.taxcalculator.dto;

import java.math.BigDecimal;

public class AdminDashboardResponse {
    private long totalUsers;
    private long totalProducts;
    private BigDecimal totalValue;
    private BigDecimal totalTax;
    private BigDecimal totalPaidTax;
    private BigDecimal totalUnpaidTax;
    private long paidTaxProducts;
    private long unpaidTaxProducts;

    public AdminDashboardResponse() {}

    public AdminDashboardResponse(long totalUsers, long totalProducts, BigDecimal totalValue,
                                  BigDecimal totalTax, BigDecimal totalPaidTax, BigDecimal totalUnpaidTax,
                                  long paidTaxProducts, long unpaidTaxProducts) {
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.totalValue = totalValue;
        this.totalTax = totalTax;
        this.totalPaidTax = totalPaidTax;
        this.totalUnpaidTax = totalUnpaidTax;
        this.paidTaxProducts = paidTaxProducts;
        this.unpaidTaxProducts = unpaidTaxProducts;
    }

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

    public BigDecimal getTotalTax() { return totalTax; }
    public void setTotalTax(BigDecimal totalTax) { this.totalTax = totalTax; }

    public BigDecimal getTotalPaidTax() { return totalPaidTax; }
    public void setTotalPaidTax(BigDecimal totalPaidTax) { this.totalPaidTax = totalPaidTax; }

    public BigDecimal getTotalUnpaidTax() { return totalUnpaidTax; }
    public void setTotalUnpaidTax(BigDecimal totalUnpaidTax) { this.totalUnpaidTax = totalUnpaidTax; }

    public long getPaidTaxProducts() { return paidTaxProducts; }
    public void setPaidTaxProducts(long paidTaxProducts) { this.paidTaxProducts = paidTaxProducts; }

    public long getUnpaidTaxProducts() { return unpaidTaxProducts; }
    public void setUnpaidTaxProducts(long unpaidTaxProducts) { this.unpaidTaxProducts = unpaidTaxProducts; }
}