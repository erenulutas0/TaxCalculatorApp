package com.eren.taxcalculator.controller;

import com.eren.taxcalculator.dto.JwtResponse;
import com.eren.taxcalculator.dto.LoginRequest;
import com.eren.taxcalculator.dto.MessageResponse;
import com.eren.taxcalculator.dto.RegistrationRequest;
import com.eren.taxcalculator.dto.UserResponse;
import com.eren.taxcalculator.model.User;
import com.eren.taxcalculator.security.jwt.JwtUtils;
import com.eren.taxcalculator.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          AuthService authService,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    // Test endpoint'i ekleyin
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("AuthController çalışıyor!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            // User ID'yi almak için repository'den çekin
            User user = authService.findByUsername(userDetails.getUsername());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    roles));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest registrationRequest) {
        try {
            if (authService.existsByUsername(registrationRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Username is already taken!"));
            }

            if (authService.existsByEmail(registrationRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            UserResponse user = authService.registerNewUser(registrationRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        try {
            List<UserResponse> users = authService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}