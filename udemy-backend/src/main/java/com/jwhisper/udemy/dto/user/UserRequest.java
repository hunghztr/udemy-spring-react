package com.jwhisper.udemy.dto.user;

import com.jwhisper.udemy.model.Role;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    String id;
    String username;
    String fullname;
    String password;
    Role role;
}
