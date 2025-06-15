package com.eren.taxcalculator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.eren.taxcalculator.controller",
        "com.eren.taxcalculator.service",
        "com.eren.taxcalculator.config",
        "com.eren.taxcalculator.security",
        "com.eren.taxcalculator.aspect",
        "com.eren.taxcalculator.repository"
})
public class TaxCalculatorApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaxCalculatorApplication.class, args);
    }
}
