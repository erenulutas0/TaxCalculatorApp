// filepath: c:\Users\pc\OneDrive\Masaüstü\TaxCalculator\src\main\java\com\eren\taxcalculator\dto\ProductResponse.java
package com.eren.taxcalculator.dto;

import com.eren.taxcalculator.model.ProductType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {
    private String id;
    private String name;
    private ProductType type;
    private BigDecimal price;
    private LocalDateTime purchaseDate;
    private boolean taxPaid;
    private BigDecimal tax;
    private String userId;
    private String description;     // Bu field'ı ekleyin
    private BigDecimal taxAmount;   // Bu field'ı ekleyin
    private LocalDateTime taxDueDate; // Bu field'ı ekleyin
    private String ownerId; // Bu field'ı ekleyin (userId ile aynı)

    // Constructors
    public ProductResponse() {}

    // ProductServiceImpl'de kullanılan constructor
    public ProductResponse(String id, String name, ProductType type, BigDecimal price, String description, BigDecimal taxAmount) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;
        this.description = description;
        this.taxAmount = taxAmount;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProductType getType() {
        return type;
    }

    public void setType(ProductType type) {
        this.type = type;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public boolean isTaxPaid() {
        return taxPaid;
    }

    public void setTaxPaid(boolean taxPaid) {
        this.taxPaid = taxPaid;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public LocalDateTime getTaxDueDate() {
        return taxDueDate;
    }

    public void setTaxDueDate(LocalDateTime taxDueDate) {
        this.taxDueDate = taxDueDate;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }
}