package com.jwhisper.udemy.elasticsearch;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;

public interface SearchService {
    void indexCourse(String courseId);
    void deleteCourse(String courseId);
    Pagination<CourseSearchResponse> searchFuzzi(Pageable pageable,String keyword);
    List<CourseSearchResponse> getFeaturestCourses();
}
