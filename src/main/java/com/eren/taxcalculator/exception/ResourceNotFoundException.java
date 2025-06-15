package com.eren.taxcalculator.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // Bu anotasyon, Spring MVC'nin bu hatayı otomatik olarak 404'e map etmesini sağlar (ControllerAdvice olmasa bile)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}