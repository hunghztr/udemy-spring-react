package com.jwhisper.udemy.dto.auth;

import org.springframework.http.ResponseCookie;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginResponse {
  String accessToken;
  String refreshToken;
  ResponseCookie cookie;

}
