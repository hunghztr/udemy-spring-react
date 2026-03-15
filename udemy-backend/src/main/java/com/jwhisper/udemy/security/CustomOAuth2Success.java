package com.jwhisper.udemy.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.jwhisper.udemy.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Component
public class CustomOAuth2Success implements AuthenticationSuccessHandler {
  private final AuthService authService;
  @Value("${whisper.jwt.refresh-token-validity-in-seconds}")
  private long refreshTokenExpiration;
  @Value("${app.frontend-url}")
  private String frontendUrl;
  public CustomOAuth2Success(AuthService authService) {
    this.authService = authService;
  }

  @Override
  @Transactional
  public void onAuthenticationSuccess(
      HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication)
      throws IOException {

    OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

    String email = oauthUser.getAttribute("email");
    var loginResponse = this.authService.setUpLoginResponse(email);
    ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", loginResponse.getRefreshToken())
        .httpOnly(true)
        .path("/")
        .maxAge(this.refreshTokenExpiration)
        .build();
    response.addHeader("Set-Cookie", refreshCookie.toString());
    response.sendRedirect(this.frontendUrl + "/oauth2/callback");
  }

}
