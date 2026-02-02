package com.jwhisper.udemy.dto.course;

import com.jwhisper.udemy.helper.constant.CourseStatus;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseResponse {
    String id;
    String name;
    int star;
    int sold;
    double hour;
    CourseStatus status;
}
