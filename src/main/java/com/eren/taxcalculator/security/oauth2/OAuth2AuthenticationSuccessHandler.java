package com.eren.taxcalculator.security.oauth2;

import com.eren.taxcalculator.security.UserPrincipal;
import com.eren.taxcalculator.security.jwt.JwtUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        if (response.isCommitted()) {
            return;
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtUtils.generateJwtToken(authentication);

        // Frontend'e token ile redirect (veya JSON response)
        String targetUrl = "http://localhost:3000/oauth2/redirect?token=" + token;

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}