package com.eren.taxcalculator.service;

import com.eren.taxcalculator.dto.RegistrationRequest;
import com.eren.taxcalculator.dto.UserResponse;
import com.eren.taxcalculator.model.User;
import java.util.List;

public interface AuthService {
    UserResponse registerNewUser(RegistrationRequest registrationRequest); // Return type değişti
    List<UserResponse> getAllUsers();
    User findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}