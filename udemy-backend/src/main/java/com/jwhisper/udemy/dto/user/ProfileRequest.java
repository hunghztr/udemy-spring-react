package com.jwhisper.udemy.dto.user;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileRequest {
    String id;
    String fullname;
    String description;
    String avatarPath;

}
