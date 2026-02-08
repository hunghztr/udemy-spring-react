package com.jwhisper.udemy.service;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;

public interface SearchService {
    void indexCourse(String courseId);
    void deleteCourse(String courseId);
    Pagination<CourseSearchResponse> searchFuzzi(Pageable pageable,String keyword);
}
