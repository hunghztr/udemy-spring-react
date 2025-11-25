package com.jwhisper.udemy.dto.auth;

import org.springframework.http.ResponseCookie;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginResponse {
  Response response;
  ResponseCookie cookie;

  @Data
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class Response {
    String accessToken;
    String refreshToken;
    UserToken user;
  }
}
