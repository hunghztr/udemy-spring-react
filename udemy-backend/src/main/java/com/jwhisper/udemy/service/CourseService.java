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
    boolean isPriceUpdated(CourseRequest request);
    CourseDetailResponse getDetail(String id);
    boolean isImageUpdate(CourseRequest request);
    boolean isDescriptionUpdated(CourseRequest request) ;
    boolean isCreated(CourseRequest request) ;
    Pagination<CourseResponse> getAllByAuthor(Specification<Course> spec, Pageable pageable);
    Pagination<CourseProject> getAll(Pageable pageable , boolean isActive,String keyword);
    boolean delete(String id);
    boolean active(String id);
    boolean deleteByInstructor(String id);
    boolean activeByInstructor(String id);

}
