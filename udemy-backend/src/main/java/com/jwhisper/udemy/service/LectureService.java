package com.jwhisper.udemy.service;

import java.util.List;

import com.jwhisper.udemy.dto.course.LectureRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;
import com.jwhisper.udemy.dto.learning.FinishResponse;

public interface LectureService {
    SectionResponse create(String courseId, LectureRequest request);    
    SectionResponse delete(String id , String courseId);
    SectionResponse updatedVideo(String courseId,LectureRequest request);
    SectionResponse updateName(String courseId,LectureRequest request);
    SectionResponse reorder(List<String> lectureIds,String sectionId);
    FinishResponse markFinish(String lectureId,boolean finish);
}
