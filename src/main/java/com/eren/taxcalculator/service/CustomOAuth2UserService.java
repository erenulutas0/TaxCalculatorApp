package com.eren.taxcalculator.service;

import com.eren.taxcalculator.model.Role;
import com.eren.taxcalculator.model.RoleName;
import com.eren.taxcalculator.model.User;
import com.eren.taxcalculator.repository.RoleRepository;
import com.eren.taxcalculator.repository.UserRepository;
import com.eren.taxcalculator.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            logger.error("Error processing OAuth2 user", ex);
            throw new OAuth2AuthenticationException("Error processing OAuth2 user: " + ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        Map<String, Object> attributes = oauth2User.getAttributes();
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        String email = extractEmail(attributes, registrationId);
        String name = extractName(attributes, registrationId);

        if (!StringUtils.hasText(email)) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            user = updateExistingUser(user, attributes);
        } else {
            user = registerNewUser(email, name, attributes);
        }

        // UserPrincipal oluştur ve OAuth2User olarak döndür
        return UserPrincipal.create(user, attributes);
    }

    private String extractEmail(Map<String, Object> attributes, String registrationId) {
        switch (registrationId.toLowerCase()) {
            case "google":
                return (String) attributes.get("email");
            case "github":
                return (String) attributes.get("email");
            case "facebook":
                return (String) attributes.get("email");
            default:
                return (String) attributes.get("email");
        }
    }

    private String extractName(Map<String, Object> attributes, String registrationId) {
        switch (registrationId.toLowerCase()) {
            case "google":
                return (String) attributes.get("name");
            case "github":
                return (String) attributes.get("login");
            case "facebook":
                return (String) attributes.get("name");
            default:
                return (String) attributes.get("name");
        }
    }

    private User registerNewUser(String email, String name, Map<String, Object> attributes) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(name != null ? name : email.split("@")[0]);
        user.setPassword(""); // OAuth2 kullanıcıları için şifre gerekmez
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setAttributes(attributes);

        // Varsayılan USER rolü ata
        Role userRole = roleRepository.findByName(RoleName.USER)
                .orElseGet(() -> {
                    logger.info("Role {} not found, creating it.", RoleName.USER);
                    return roleRepository.save(new Role(RoleName.USER));
                });

        user.setRoles(Set.of(userRole));

        logger.info("Registering new OAuth2 user: {}", email);
        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, Map<String, Object> attributes) {
        existingUser.setAttributes(attributes);
        return userRepository.save(existingUser);
    }
}