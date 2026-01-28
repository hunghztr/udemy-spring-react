package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.course.CourseDetailResponse;
import com.jwhisper.udemy.dto.course.CourseRequest;
import com.jwhisper.udemy.dto.course.CourseResponse;
import com.jwhisper.udemy.dto.course.LectureRequest;
import com.jwhisper.udemy.dto.course.LectureResponse;
import com.jwhisper.udemy.dto.course.SectionRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Lecture;
import com.jwhisper.udemy.model.Section;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CourseMapper {
    CourseResponse toCourseResponse(Course course);
    CourseDetailResponse toCourseDetailResponse(Course course);
    SectionResponse toSectionResponse(Section section);
    LectureResponse toLectureResponse(Lecture lecture);
    Course toCourse(CourseRequest request);
    Section toSection(SectionRequest request);
    Lecture toLecture(LectureRequest request);
}

