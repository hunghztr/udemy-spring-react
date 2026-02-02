package com.jwhisper.udemy.service;

import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;

import com.jwhisper.udemy.dto.auth.LoginRequest;
import com.jwhisper.udemy.dto.auth.LoginResponse;
import com.jwhisper.udemy.dto.auth.RegisterRequest;
import com.jwhisper.udemy.projection.user.UserDetail;

public interface AuthService {
  LoginResponse setUpLoginResponse(String username);

  void register(RegisterRequest request) ;

  LoginResponse login(LoginRequest request) throws BadCredentialsException;

  LoginResponse logout(String accessToken,String resetToken);

  void isValidMail(String mail) ;

  ResponseCookie isValidOtp(String otp, String email) ;

  void changePassword( String resetToken, String password) ;

  UserDetail getCurrentUser() ;

  ResponseCookie refreshToken(String refreshToken) ;

}