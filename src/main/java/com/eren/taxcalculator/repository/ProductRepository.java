package com.eren.taxcalculator.repository;

import com.eren.taxcalculator.model.Product;
import com.eren.taxcalculator.model.ProductType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByUserId(String userId);
    List<Product> findByType(ProductType type);
    List<Product> findByUserIdAndType(String userId, ProductType type);
}