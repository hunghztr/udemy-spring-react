package com.jwhisper.udemy.helper.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.document.CourseDocument;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;
import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.model.Course;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ESCourseMapper {

    @Mapping(source = "categories",target = "categories")
    @Mapping(source = "author.fullname",target = "authorName")
    CourseDocument toCourseDocument(Course course);
    
    default List<String> map(List<Category> categories) {
        if (categories == null) return List.of();
        return categories.stream()
                .map(Category::getName)
                .toList();
    }
    CourseSearchResponse toCourseSearchResponse(CourseDocument document);
}
