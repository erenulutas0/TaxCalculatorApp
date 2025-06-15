package com.eren.taxcalculator.model;

import com.eren.taxcalculator.model.ProductType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Document(collection = "products")
public class Product {

    @Id
    private String id;
    private String name;
    private BigDecimal price;
    private ProductType type;
    private String description;
    private String userId;
    private boolean taxPaid = false;
    private LocalDate taxDueDate;

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

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    // Backward compatibility için
    public String getOwnerId() { return userId; }
    public void setOwnerId(String ownerId) { this.userId = ownerId; }

    public boolean isTaxPaid() { return taxPaid; }
    public void setTaxPaid(boolean taxPaid) { this.taxPaid = taxPaid; }

    public LocalDate getTaxDueDate() { return taxDueDate; }
    public void setTaxDueDate(LocalDate taxDueDate) { this.taxDueDate = taxDueDate; }

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