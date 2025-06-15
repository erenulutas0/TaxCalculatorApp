package com.eren.taxcalculator.service;

import com.eren.taxcalculator.dto.RegistrationRequest;
import com.eren.taxcalculator.dto.UserResponse;
import com.eren.taxcalculator.exception.ResourceNotFoundException;
import com.eren.taxcalculator.exception.UserAlreadyExistsException;
import com.eren.taxcalculator.model.Role;
import com.eren.taxcalculator.model.RoleName;
import com.eren.taxcalculator.model.User;
import com.eren.taxcalculator.repository.RoleRepository;
import com.eren.taxcalculator.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    @Override
    @Transactional
    public UserResponse registerNewUser(RegistrationRequest registrationRequest) {
        if (userRepository.findByUsername(registrationRequest.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists: " + registrationRequest.getUsername());
        }
        if (userRepository.findByEmail(registrationRequest.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists: " + registrationRequest.getEmail());
        }

        User newUser = new User();
        newUser.setUsername(registrationRequest.getUsername());
        newUser.setEmail(registrationRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        newUser.setEnabled(true);
        newUser.setAccountNonExpired(true);
        newUser.setAccountNonLocked(true);
        newUser.setCredentialsNonExpired(true);

        Set<Role> roles = new HashSet<>();
        String requestedRole = registrationRequest.getRole();

        if (!StringUtils.hasText(requestedRole)) {
            Role userRole = roleRepository.findByName(RoleName.USER)
                    .orElseGet(() -> {
                        logger.info("Role {} not found, creating it.", RoleName.USER);
                        return roleRepository.save(new Role(RoleName.USER));
                    });
            roles.add(userRole);
        } else {
            if ("ADMIN".equalsIgnoreCase(requestedRole)) {
                Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                        .orElseGet(() -> {
                            logger.info("Role {} not found, creating it.", RoleName.ADMIN);
                            return roleRepository.save(new Role(RoleName.ADMIN));
                        });
                roles.add(adminRole);
            } else {
                Role userRole = roleRepository.findByName(RoleName.USER)
                        .orElseGet(() -> {
                            logger.info("Role {} not found, creating it.", RoleName.USER);
                            return roleRepository.save(new Role(RoleName.USER));
                        });
                roles.add(userRole);
            }
        }
        newUser.setRoles(roles);

        User savedUser = userRepository.save(newUser);
        logger.info("New user registered successfully: {} with roles: {}", savedUser.getUsername(), savedUser.getRoles());

        return new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet())
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRoles().stream()
                                .map(role -> role.getName().name())
                                .collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());
    }
}