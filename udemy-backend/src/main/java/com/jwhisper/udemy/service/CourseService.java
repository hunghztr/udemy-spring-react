package com.jwhisper.udemy.service;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseDetailResponse;
import com.jwhisper.udemy.dto.course.CourseRequest;
import com.jwhisper.udemy.dto.course.CourseResponse;

import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.Course;

public interface CourseService {
    CourseDetailResponse getDetail(String id) throws ErrorException;
    // boolean isLectureUpdated(TwoListRequest<LectureRequest,String> request,String courseId);
    // CourseDetailResponse updateSection(TwoListRequest<SectionRequest,String> request,String courseId);
    boolean isDescriptionUpdated(CourseRequest request) throws ErrorException;
    boolean isCreated(CourseRequest request) throws ErrorException;
    Pagination<CourseResponse> getAllByAuthor(Specification<Course> spec, Pageable pageable) throws ErrorException;
}
