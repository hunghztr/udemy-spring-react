package com.jwhisper.udemy.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.SliceResponse;
import com.jwhisper.udemy.dto.course.CourseInfoResponse;
import com.jwhisper.udemy.dto.learning.LearningResponse;
import com.jwhisper.udemy.dto.rating.RatingRequest;
import com.jwhisper.udemy.dto.rating.RatingResponse;

public interface LearningService {
    List<LearningResponse> getAll(String status);
    CourseInfoResponse learning(String courseId);
    SliceResponse<RatingResponse> getRatings(String courseId,Pageable pageable);
    RatingResponse createRating(RatingRequest request,String courseId);
    long countRatings(String courssId);
    void delete(String userId, String courseId);
    RatingResponse getByUserAndCourse(String userId,String courseId);
}
