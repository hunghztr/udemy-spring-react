package com.jwhisper.udemy.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.dto.course.CourseInfoResponse;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;
import com.jwhisper.udemy.dto.course.FilterRequest;
import com.jwhisper.udemy.projection.category.CategoryCourseProjection;

public interface HomeService {
    Pagination<CourseSearchResponse> getCoursesByCategory(String id,Pageable pageable, FilterRequest filterRequest);
    List<CourseSearchResponse> getInterestedCourses();
    CourseInfoResponse getCourseDetail(String id);
    Pagination<CategoryParentResponse> getAllParents(Pageable pageable, boolean isActive);
    List<CategoryCourseProjection> getAllChildren();
}
