package com.jwhisper.udemy.dto.auth;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserToken {
  String id;
  String username;
  String fullname;
  String role;

}