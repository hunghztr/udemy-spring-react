package com.jwhisper.udemy.service;

import java.util.List;

import com.jwhisper.udemy.dto.course.CourseInfoResponse;
import com.jwhisper.udemy.dto.learning.LearningResponse;

public interface LearningService {
    List<LearningResponse> getAll(String status);
    CourseInfoResponse learning(String courseId);
}
