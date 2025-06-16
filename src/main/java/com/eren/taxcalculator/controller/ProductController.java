package com.eren.taxcalculator.controller;

import com.eren.taxcalculator.dto.*;
import com.eren.taxcalculator.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductCreateRequest request, Principal principal) {
        try {
            ProductResponse product = productService.createProduct(request, principal.getName());
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ProductResponse>> getUserProducts(Principal principal) {
        try {
            List<ProductResponse> products = productService.getUserProducts(principal.getName());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable String id,
                                           @Valid @RequestBody ProductUpdateRequest request,
                                           Principal principal) {
        try {
            ProductResponse product = productService.updateProduct(id, request, principal.getName());
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable String id, Principal principal) {
        try {
            productService.deleteProduct(id, principal.getName());
            return ResponseEntity.ok(new MessageResponse("Product deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/tax-calculation")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TaxCalculationResponse> calculateTotalTax(Principal principal) {
        try {
            TaxCalculationResponse response = productService.calculateUserTotalTax(principal.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ProductSummaryResponse> getProductSummary(Principal principal) {
        try {
            ProductSummaryResponse summary = productService.getUserProductSummary(principal.getName());
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/pay-tax")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> payTax(@PathVariable String id, Principal principal) {
        try {
            ProductResponse product = productService.payTax(id, principal.getName());
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}