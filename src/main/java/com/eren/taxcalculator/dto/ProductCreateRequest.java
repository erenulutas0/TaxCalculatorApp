package com.eren.taxcalculator.dto;

import com.eren.taxcalculator.model.ProductType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ProductCreateRequest {

    @NotBlank(message = "Product name cannot be empty")
    private String name;

    @NotNull(message = "Price must be specified")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Product type must be specified")
    private ProductType type;

    private String description;

    // Constructors
    public ProductCreateRequest() {}

    public ProductCreateRequest(String name, BigDecimal price, ProductType type, String description) {
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