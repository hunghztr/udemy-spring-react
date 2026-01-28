package com.jwhisper.udemy.service;

import java.util.List;

import com.jwhisper.udemy.dto.course.LectureRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;

public interface LectureService {
    SectionResponse create(LectureRequest request,String courseId);    
    SectionResponse delete(String id , String courseId);
    SectionResponse updatedVideo(LectureRequest request,String courseId);
    SectionResponse updateName(LectureRequest request,String courseId);
    SectionResponse reorder(List<String> lectureIds,String sectionId);
}
