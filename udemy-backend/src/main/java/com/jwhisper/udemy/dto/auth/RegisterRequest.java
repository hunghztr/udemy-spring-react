package com.jwhisper.udemy.dto.auth;

import com.jwhisper.udemy.helper.constant.LoginMethod;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
  @NotBlank
  @NonNull
  String username;
  @NotBlank
  @NonNull
  String password;
  @NotBlank
  @NotNull
  String fullname;
  LoginMethod method = LoginMethod.CREDENTIAL;
}
