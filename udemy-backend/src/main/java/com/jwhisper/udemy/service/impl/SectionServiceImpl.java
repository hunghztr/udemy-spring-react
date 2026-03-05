package com.jwhisper.udemy.service.impl;


import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.course.SectionRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;
import com.jwhisper.udemy.helper.annotation.CheckCourseOwner;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Section;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.SectionRepository;
import com.jwhisper.udemy.service.SectionService;

import jakarta.transaction.Transactional;

@Service
public class SectionServiceImpl implements SectionService {
    private final SectionRepository sectionRepository;
    private final CourseMapper courseMapper;
    private final CourseRepository courseRepository;
    public SectionServiceImpl(SectionRepository sectionRepository,
         CourseMapper courseMapper,
         CourseRepository courseRepository
    ){
        this.sectionRepository = sectionRepository;
        this.courseMapper = courseMapper;
        this.courseRepository = courseRepository;
    }
    @Override
    @CheckCourseOwner
    @Transactional
    public SectionResponse create(SectionRequest request,String courseId) {
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        course.setTotalSection(course.getTotalSection() + 1);
        Section section = this.courseMapper.toSection(request);
        section.setCourse(course);
        section = this.sectionRepository.save(section);
        return this.courseMapper.toSectionResponse(section);
    }
    @Override
    @Transactional
    @CheckCourseOwner
    public boolean isDeleted(String id,String courseId) {
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        course.setTotalSection(course.getTotalSection() - 1);
        this.sectionRepository.deleteById(id);
        double totalHour =
        sectionRepository.sumHourByCourseId(course.getId());
        course.setHour(totalHour);
        return true;
    }
    @Override
    @CheckCourseOwner
    public SectionResponse updateName(SectionRequest request, String courseId) {
        Section section = this.sectionRepository.findById(request.getId())
        .orElseThrow(() -> new ErrorException("Chương học không tồn tại"));
        section.setName(request.getName());
        section = this.sectionRepository.save(section);
        return this.courseMapper.toSectionResponse(section);
    }
    
}
