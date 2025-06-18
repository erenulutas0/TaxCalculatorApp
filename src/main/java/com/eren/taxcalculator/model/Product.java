package com.eren.taxcalculator.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private ProductType type;
    private BigDecimal price;
    private LocalDateTime purchaseDate;
    private boolean taxPaid;
    private String userId;
    private String description;
    private LocalDateTime taxDueDate; // Tax due date field

    // Constructors
    public Product() {}

    public Product(String name, BigDecimal price, ProductType type, String description, String userId) {
        this.name = name;
        this.price = price;
        this.type = type;
        this.description = description;
        this.userId = userId;
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

    public LocalDateTime getTaxDueDate() {
        return taxDueDate;
    }

    public void setTaxDueDate(LocalDateTime taxDueDate) {
        this.taxDueDate = taxDueDate;
    }

    // Backward compatibility methods
    public String getOwnerId() { return userId; }
    public void setOwnerId(String ownerId) { this.userId = ownerId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}