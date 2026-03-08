package com.jwhisper.udemy.service;

import java.util.List;

import com.jwhisper.udemy.dto.course.CourseResponse;

public interface OrderService {
    List<CourseResponse> getBoughtCourses(String username);
    boolean checkCourse(List<String> coursesId);
}
