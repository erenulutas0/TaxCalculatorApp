package com.eren.taxcalculator.dto;

import java.math.BigDecimal;

public class UserWithProductsResponse {
    private String id;
    private String username;
    private String email;
    private long productCount;
    private BigDecimal totalValue;
    private BigDecimal totalTax;
    private BigDecimal paidTax;
    private BigDecimal unpaidTax;
    private long paidTaxCount;
    private long unpaidTaxCount;

    public UserWithProductsResponse() {}

    public UserWithProductsResponse(String id, String username, String email, long productCount,
                                    BigDecimal totalValue, BigDecimal totalTax, BigDecimal paidTax,
                                    BigDecimal unpaidTax, long paidTaxCount, long unpaidTaxCount) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.productCount = productCount;
        this.totalValue = totalValue;
        this.totalTax = totalTax;
        this.paidTax = paidTax;
        this.unpaidTax = unpaidTax;
        this.paidTaxCount = paidTaxCount;
        this.unpaidTaxCount = unpaidTaxCount;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public long getProductCount() { return productCount; }
    public void setProductCount(long productCount) { this.productCount = productCount; }

    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

    public BigDecimal getTotalTax() { return totalTax; }
    public void setTotalTax(BigDecimal totalTax) { this.totalTax = totalTax; }

    public BigDecimal getPaidTax() { return paidTax; }
    public void setPaidTax(BigDecimal paidTax) { this.paidTax = paidTax; }

    public BigDecimal getUnpaidTax() { return unpaidTax; }
    public void setUnpaidTax(BigDecimal unpaidTax) { this.unpaidTax = unpaidTax; }

    public long getPaidTaxCount() { return paidTaxCount; }
    public void setPaidTaxCount(long paidTaxCount) { this.paidTaxCount = paidTaxCount; }

    public long getUnpaidTaxCount() { return unpaidTaxCount; }
    public void setUnpaidTaxCount(long unpaidTaxCount) { this.unpaidTaxCount = unpaidTaxCount; }
}