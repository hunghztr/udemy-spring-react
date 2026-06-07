package com.jwhisper.udemy.dto.user;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstructorRevenueResponse {
    String instructorId;
    String instructorName;
    double totalRevenue;
    List<CourseRevenueDetail> courseDetails;

    @Data
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CourseRevenueDetail {
        String courseId;
        String courseName;
        double revenue;
        int sold;
    }
}

