// filepath: c:\Users\pc\OneDrive\Masaüstü\TaxCalculator\src\main\java\com\eren\taxcalculator\dto\ProductResponse.java
package com.eren.taxcalculator.dto;

import com.eren.taxcalculator.model.ProductType;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductResponse {

    private String id;
    private String name;
    private BigDecimal price;
    private ProductType type;
    private String description;
    private BigDecimal taxAmount;
    private String ownerId;
    private boolean taxPaid;
    private LocalDate taxDueDate;

    // Default constructor
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
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public ProductType getType() { return type; }
    public void setType(ProductType type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public boolean isTaxPaid() { return taxPaid; }
    public void setTaxPaid(boolean taxPaid) { this.taxPaid = taxPaid; }

    public LocalDate getTaxDueDate() { return taxDueDate; }
    public void setTaxDueDate(LocalDate taxDueDate) { this.taxDueDate = taxDueDate; }
}