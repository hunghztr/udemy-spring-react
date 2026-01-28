package com.jwhisper.udemy.service;

import com.jwhisper.udemy.dto.course.SectionRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;

public interface SectionService {
    SectionResponse updateName(SectionRequest request,String courseId);
    SectionResponse create(SectionRequest request,String courseId);
    boolean isDeleted(String id,String courseId);
}
