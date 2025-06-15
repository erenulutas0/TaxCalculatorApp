package com.eren.taxcalculator.dto;

import com.eren.taxcalculator.model.ProductType;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ProductUpdateRequest {

    private String name;

    @Positive(message = "Fiyat pozitif olmalıdır")
    private BigDecimal price;

    private ProductType type;

    private String description;

    // Constructors
    public ProductUpdateRequest() {}

    public ProductUpdateRequest(String name, BigDecimal price, ProductType type, String description) {
        this.name = name;
        this.price = price;
        this.type = type;
        this.description = description;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public ProductType getType() { return type; }
    public void setType(ProductType type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}