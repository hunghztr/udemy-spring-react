package com.jwhisper.udemy.elasticsearch;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;
import com.jwhisper.udemy.dto.course.FilterRequest;

public interface SearchService {
    Pagination<CourseSearchResponse> getCoursesByCategory(String categoryName,Pageable pageable, FilterRequest filterRequest);
    void indexCourse(String courseId);
    void deleteCourse(String courseId);
    Pagination<CourseSearchResponse> searchFuzzi(Pageable pageable,String keyword,FilterRequest filterRequest);
    List<CourseSearchResponse> getFeaturestCourses();
}
