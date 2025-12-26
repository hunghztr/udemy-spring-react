package com.jwhisper.udemy.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.StringResult;
import com.jwhisper.udemy.dto.auth.LoginRequest;
import com.jwhisper.udemy.dto.auth.LoginResponse;
import com.jwhisper.udemy.dto.auth.MailRequest;
import com.jwhisper.udemy.dto.auth.RegisterRequest;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.projection.user.UserDetail;
import com.jwhisper.udemy.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/auth/register")
  @ApiMessage("Đăng kí thành công")
  public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) throws ErrorException {
    authService.register(request);
    return ResponseEntity.ok().body(true);
  }

  @PostMapping("/auth/login")
  @ApiMessage("Đăng nhập thành công")
  public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
    LoginResponse response = this.authService.login(request);
    StringResult result = new StringResult();
    result.setResult(response.getAccessToken());
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, response.getCookie().toString())
        .body(result);
  }

  @GetMapping("/me")
  public ResponseEntity<?> me() throws ErrorException {
    UserDetail detail = this.authService.getCurrentUser();
    return ResponseEntity.ok().body(detail);
  }

  @PostMapping("/auth/refresh-token")
  public ResponseEntity<?> refreshToken(@CookieValue(name = "refresh_token", defaultValue = "none") String refreshToken)
      throws ErrorException {
    String accessToken = this.authService.refreshToken(refreshToken);
    StringResult result = new StringResult();
    result.setResult(accessToken);
    return ResponseEntity.ok().body(result);
  }

  @PostMapping("/auth/logout")
  @ApiMessage("Đăng xuất thành công")
  public ResponseEntity<?> logout(
      // @RequestHeader(value = "Authorization", required = false) String
      // authorization
      @RequestBody String accessToken) {

    ResponseCookie cookie = this.authService.logout(accessToken);

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(true);
  }

  @PostMapping("/auth/verify-mail")
  @ApiMessage("Xác thực mail thành công")
  public ResponseEntity<?> validMail(@RequestBody MailRequest request) throws ErrorException {
    this.authService.isValidMail(request.getEmail());
    return ResponseEntity.ok().body(true);
  }

  @PostMapping("/auth/verify-otp")
  @ApiMessage("Xác thực otp thành công")
  public ResponseEntity<?> validOtp(@RequestBody MailRequest request) throws ErrorException {
    String resetToken = this.authService.isValidOtp(request.getValue(), request.getEmail());
    StringResult resetTokenResult = new StringResult();
    resetTokenResult.setResult(resetToken);
    return ResponseEntity.ok().body(resetTokenResult);
  }

  @PostMapping("/auth/change-password")
  @ApiMessage("Đổi mật khẩu thành công")
  public ResponseEntity<?> changePassword(@RequestBody MailRequest request) throws ErrorException {
    this.authService.changePassword(request.getEmail(), request.getResetToken(), request.getValue());
    return ResponseEntity.ok().body(true);
  }

  @GetMapping("/auth/login-with-provider")
  public void loginWithProvider(HttpServletResponse response) throws IOException {
    response.sendRedirect("/oauth2/authorization/google");
  }

}
