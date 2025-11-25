package com.jwhisper.udemy.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
  @NotBlank
  @NotNull
  String username;
  @NotBlank
  @NotNull
  String password;
}
