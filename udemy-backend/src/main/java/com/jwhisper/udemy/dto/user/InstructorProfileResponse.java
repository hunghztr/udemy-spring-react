package com.jwhisper.udemy.dto.user;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstructorProfileResponse {
    String id;
    String fullname;
    String avatarPath;
    String description;
    String roleName;

    // Stats
    long totalCourses;
    long totalStudents;   // tổng học viên của tất cả khoá học
    double avgRating;     // rating trung bình
}
