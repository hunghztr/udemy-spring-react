package com.jwhisper.udemy.dto.rating;

import java.time.Instant;

import com.jwhisper.udemy.dto.user.UserResponse;
import com.jwhisper.udemy.model.UserCourseKey;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RatingResponse {
    UserCourseKey id;
    Double star;
    String message;
    UserResponse customer;
    Instant createdAt;
}
