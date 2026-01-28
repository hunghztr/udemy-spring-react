package com.jwhisper.udemy.service.impl;


import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.course.SectionRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Section;
import com.jwhisper.udemy.repository.SectionRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.SectionService;

@Service
public class SectionServiceImpl implements SectionService {
    private final SectionRepository sectionRepository;
    private final SecurityHelper securityHelper;
    private final CourseMapper courseMapper;
    public SectionServiceImpl(SectionRepository sectionRepository,
        SecurityHelper securityHelper, CourseMapper courseMapper
    ){
        this.sectionRepository = sectionRepository;
        this.securityHelper = securityHelper;
        this.courseMapper = courseMapper;
    }
    @Override
    public SectionResponse create(SectionRequest request,String courseId) {
        Course course = this.securityHelper.checkCourseUser(courseId);
        Section section = this.courseMapper.toSection(request);
        section.setCourse(course);
        section = this.sectionRepository.save(section);
        return this.courseMapper.toSectionResponse(section);
    }
    @Override
    public boolean isDeleted(String id,String courseId) {
        this.securityHelper.checkCourseUser(courseId);
        this.sectionRepository.deleteById(id);
        return true;
    }
    @Override
    public SectionResponse updateName(SectionRequest request, String courseId) {
        this.securityHelper.checkCourseUser(courseId);
        Section section = this.sectionRepository.findById(request.getId())
        .orElseThrow(() -> new ErrorException("Chương học không tồn tại"));
        section.setName(request.getName());
        section = this.sectionRepository.save(section);
        return this.courseMapper.toSectionResponse(section);
    }
    
}
