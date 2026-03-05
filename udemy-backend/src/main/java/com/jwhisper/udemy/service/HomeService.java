package com.jwhisper.udemy.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.dto.course.CourseInfoResponse;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;

public interface HomeService {
    List<CourseSearchResponse> getInterestedCourses();
    CourseInfoResponse getCourseDetail(String id);
    Pagination<CategoryParentResponse> getAllParents(Pageable pageable, boolean isActive);
}
