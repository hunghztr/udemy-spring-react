package com.jwhisper.udemy.service;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseDetailResponse;
import com.jwhisper.udemy.dto.course.CourseRequest;
import com.jwhisper.udemy.dto.course.CourseResponse;

import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.projection.course.CourseProject;

public interface CourseService {
    CourseResponse updateImage(CourseRequest request);
    CourseResponse updateDesc(CourseRequest request);
    CourseResponse updatePrice(CourseRequest request);
    CourseResponse create(CourseRequest request);
    boolean delete(String id);
    boolean active(String id);
    boolean deleteByInstructor(String id);
    boolean activeByInstructor(String id);
    CourseDetailResponse getDetail(String id);
    Pagination<CourseResponse> getAllByAuthor(Specification<Course> spec, Pageable pageable);
    Pagination<CourseProject> getAll(Pageable pageable , boolean isActive,String keyword);
}
