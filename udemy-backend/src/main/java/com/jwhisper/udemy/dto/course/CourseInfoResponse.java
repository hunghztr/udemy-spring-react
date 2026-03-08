package com.jwhisper.udemy.dto.course;

import java.time.Instant;
import java.util.List;

import com.jwhisper.udemy.dto.category.CategoryChildResponse;
import com.jwhisper.udemy.dto.user.UserResponse;

import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CourseInfoResponse {
    String id;
    String name;
    String description;
    String requirement;
    double price;
    double hour;
    int sold;
    double star;
    int totalSection;
    String imagePath;
    List<SectionResponse> sections;
    Instant updatedAt;
    UserResponse author;
    List<CategoryChildResponse> categories;
}
