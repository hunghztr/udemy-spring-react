package com.jwhisper.udemy.controller.client;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.StringResult;
import com.jwhisper.udemy.dto.auth.LoginRequest;
import com.jwhisper.udemy.dto.auth.LoginResponse;
import com.jwhisper.udemy.dto.auth.MailRequest;
import com.jwhisper.udemy.dto.auth.RegisterRequest;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
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
import org.springframework.web.bind.annotation.RequestHeader;
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
  public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request)  {
    authService.register(request);
    return ResponseEntity.ok().body(true);
  }

  @PostMapping("/auth/login")
  @ApiMessage("Đăng nhập thành công")
  public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
    LoginResponse response = this.authService.login(request);
    StringResult result = new StringResult();
    result.setResult(response.getAccessToken());
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, response.getRefreshCookie().toString())
    .header(HttpHeaders.SET_COOKIE, response.getAccessCookie().toString())
        .body(result);
  }

  @GetMapping("/me")
  @ApiMessage("Lấy dữ liệu thành công")
  public ResponseEntity<?> me()  {
    UserDetail detail = this.authService.getCurrentUser();
    return ResponseEntity.ok().body(detail);
  }

  @PostMapping("/auth/refresh-token")
  @ApiMessage("Lấy token thành công")
  public ResponseEntity<?> refreshToken(@CookieValue(name = "refresh_token", defaultValue = "none") String refreshToken)
       {
    ResponseCookie cookie = this.authService.refreshToken(refreshToken);
    StringResult result = new StringResult();
    result.setResult(cookie.getValue());
    
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(result);
  }

  @PostMapping("/auth/logout")
  @ApiMessage("Đăng xuất thành công")
  public ResponseEntity<?> logout(
      @RequestHeader(value = "Authorization", required = false) String
      authorization, @CookieValue(name = "refresh_token",defaultValue = "none") String refreshToken){
  String accessToken = null;
  if (authorization != null && authorization.startsWith("Bearer ")) {
    accessToken = authorization.substring(7);
  }
    LoginResponse loginResponse = this.authService.logout(accessToken,refreshToken);

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, loginResponse.getRefreshCookie().toString())
    .header(HttpHeaders.SET_COOKIE, loginResponse.getAccessCookie().toString()).body(true);
  }

  @PostMapping("/auth/verify-mail")
  @ApiMessage("Xác thực mail thành công")
  public ResponseEntity<?> validMail(@RequestBody MailRequest request)  {
    this.authService.isValidMail(request.getEmail());
    return ResponseEntity.ok().body(true);
  }

  @PostMapping("/auth/verify-otp")
  @ApiMessage("Xác thực otp thành công")
  public ResponseEntity<?> validOtp(@RequestBody MailRequest request)  {
    ResponseCookie cookie = this.authService.isValidOtp(request.getValue(), request.getEmail());
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,cookie.toString()).body(true);
  }

  @PostMapping("/auth/change-password")
  @ApiMessage("Đổi mật khẩu thành công")
  public ResponseEntity<?> changePassword(@RequestBody MailRequest request,
    @CookieValue(name = "reset_token",defaultValue = "none") String resetToken
  )  {
    this.authService.changePassword(resetToken, request.getValue());
    return ResponseEntity.ok().body(true);
  }

  @GetMapping("/auth/login-with-provider")
  public void loginWithProvider(HttpServletResponse response) throws IOException {
    response.sendRedirect("/oauth2/authorization/google");
  }

}
