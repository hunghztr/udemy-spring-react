package com.jwhisper.udemy.dto.course;

import java.util.List;

import com.jwhisper.udemy.model.Coupon;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseDetailResponse {
    String id;
    String name;
    String description;
    String requirement;
    double price;
    int totalSection;
    String imagePath;
    List<Coupon> coupons;
    List<SectionResponse> sections;
}
