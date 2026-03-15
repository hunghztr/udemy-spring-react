package com.jwhisper.udemy.service;

import com.jwhisper.udemy.dto.course.SectionRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;

public interface SectionService {
    SectionResponse updateName(String courseId,SectionRequest request);
    SectionResponse create(String courseId,SectionRequest request);
    boolean isDeleted(String courseId,String id);
}
