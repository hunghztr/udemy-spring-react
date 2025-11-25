package com.jwhisper.udemy.service;

import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;

import com.jwhisper.udemy.dto.auth.LoginRequest;
import com.jwhisper.udemy.dto.auth.LoginResponse;
import com.jwhisper.udemy.dto.auth.RegisterRequest;
import com.jwhisper.udemy.helper.expception.ErrorException;

public interface AuthService {
  LoginResponse setUpLoginResponse(String username);

  void register(RegisterRequest request) throws ErrorException;

  LoginResponse login(LoginRequest request) throws BadCredentialsException;

  ResponseCookie logout(String accessToken);

  void isValidMail(String mail) throws ErrorException;

  String isValidOtp(String otp, String email) throws ErrorException;

  void changePassword(String mail, String resetToken, String password) throws ErrorException;

}