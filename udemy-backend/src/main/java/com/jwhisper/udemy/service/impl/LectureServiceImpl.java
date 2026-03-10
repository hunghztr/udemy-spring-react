package com.jwhisper.udemy.service.impl;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.course.LectureRequest;
import com.jwhisper.udemy.dto.course.LectureResponse;
import com.jwhisper.udemy.dto.course.SectionResponse;
import com.jwhisper.udemy.helper.annotation.CheckCourseOwner;
import com.jwhisper.udemy.helper.annotation.UpdateProgress;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Lecture;
import com.jwhisper.udemy.model.Section;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.LectureRepository;
import com.jwhisper.udemy.repository.SectionRepository;
import com.jwhisper.udemy.service.LectureService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LectureServiceImpl implements LectureService {
    private final LectureRepository lectureRepository;
    private final CourseMapper courseMapper;
    private final SectionRepository sectionRepository;
    private final CourseRepository courseRepository;
    public LectureServiceImpl(LectureRepository lectureRepository,
        CourseMapper courseMapper,
        SectionRepository sectionRepository,
        CourseRepository courseRepository
    ) {
        this.lectureRepository = lectureRepository;
        this.courseMapper = courseMapper;
        this.sectionRepository = sectionRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    @CheckCourseOwner
    public SectionResponse create(LectureRequest request,String courseId) {
        Lecture lecture = this.courseMapper.toLecture(request);
        Section section = this.sectionRepository.findById(lecture.getSection().getId())
        .orElseThrow(() -> new ErrorException("Chương học không tốn tại"));
        section.setTotalLecture(section.getTotalLecture()+1);
        lecture.setSection(section);
        lecture = this.lectureRepository.save(lecture);
        section.getLectures().add(lecture);
        return this.courseMapper.toSectionResponse(section);
    }

    @Override
    @Transactional
    @CheckCourseOwner
    public SectionResponse delete(String id, String courseId) {
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        Lecture lecture = this.lectureRepository.findById(id)
        .orElseThrow(() -> new ErrorException("Bài học không tồn tại"));
        Section section = lecture.getSection();
        double totalSecond =
        lectureRepository.sumSecondBySectionId(section.getId());
        section.setHour(totalSecond / 3600.0);
        section.setTotalLecture(section.getTotalLecture() - 1);
        double totalHour =
        sectionRepository.sumHourByCourseId(course.getId());
        course.setHour(totalHour);
        this.lectureRepository.deleteById(id);
        section.getLectures().remove(lecture);
        return this.courseMapper.toSectionResponse(section);
    }

    @Override
    @Transactional
    @CheckCourseOwner
    public SectionResponse updatedVideo(LectureRequest request, String courseId) {
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        Lecture lecture = this.lectureRepository.findById(request.getId()).orElseThrow(
            () ->  new ErrorException("Bài học này không tồn tại")
        );
        lecture.setPath(request.getPath());
        lecture.setSecond(request.getSecond());
        Section section = lecture.getSection();
        double totalSecond =
        lectureRepository.sumSecondBySectionId(section.getId());
        section.setHour(totalSecond / 3600.0);
        double totalHour =
        sectionRepository.sumHourByCourseId(course.getId());
        course.setHour(totalHour);
        return this.courseMapper.toSectionResponse(section);
    }

    @Override
    @CheckCourseOwner
    public SectionResponse updateName(LectureRequest request, String courseId) {
        Lecture lecture = this.lectureRepository.findById(request.getId())
        .orElseThrow(() -> new ErrorException("Bài học không tồn tại"));
        lecture.setName(request.getName());
        lecture = this.lectureRepository.save(lecture);
        return this.courseMapper.toSectionResponse(lecture.getSection());
    }

    @Override
    @Transactional
    public SectionResponse reorder(List<String> lectureIds, String sectionId) {

        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new ErrorException("Section không tồn tại"));

        List<Lecture> lectures = lectureRepository.findAllById(lectureIds);
        lectures.forEach(l -> log.info(l.getId()));
        Map<String, Lecture> map = lectures.stream()
            .collect(Collectors.toMap(Lecture::getId, Function.identity()));

        List<Lecture> ordered = new ArrayList<>();
        for (String id : lectureIds) {
            ordered.add(map.get(id));
        }
        for (int i = 0; i < ordered.size(); i++) {
            ordered.get(i).setPosition(i);
        }
        section.getLectures().clear();
        section.getLectures().addAll(ordered);

        return courseMapper.toSectionResponse(section);
    }

    @Override
    // dùng aop update progress
    @UpdateProgress
    public LectureResponse markFinish(String lectureId,Boolean finish) {
        Lecture lecture = this.lectureRepository.findById(lectureId)
        .orElseThrow(() -> new ErrorException("Bài học không tồn tại"));
        lecture.setIsFinished(finish);
        lecture = this.lectureRepository.save(lecture);
        return this.courseMapper.toLectureResponse(lecture);
    }
    
    
}
