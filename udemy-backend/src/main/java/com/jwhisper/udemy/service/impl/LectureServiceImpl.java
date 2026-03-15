package com.jwhisper.udemy.service.impl;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.ai.QuizzDebounceService;
import com.jwhisper.udemy.ai.RecommendationService;
import com.jwhisper.udemy.dto.course.LectureRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;
import com.jwhisper.udemy.dto.learning.FinishResponse;
import com.jwhisper.udemy.helper.annotation.CheckCourseOwner;
import com.jwhisper.udemy.helper.annotation.UpdateProgress;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.LearningPath;
import com.jwhisper.udemy.model.LearningPathStep;
import com.jwhisper.udemy.model.Lecture;
import com.jwhisper.udemy.model.Section;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.model.UserLectureProgress;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.LearningPathRepository;
import com.jwhisper.udemy.repository.LectureRepository;
import com.jwhisper.udemy.repository.SectionRepository;
import com.jwhisper.udemy.repository.UserLectureProgressRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
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
    private final QuizzDebounceService quizzDebounceService;
    private final UserLectureProgressRepository userLectureProgressRepository;
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final RecommendationService recommendationService;
    private final LearningPathRepository learningPathRepository;
    public LectureServiceImpl(LectureRepository lectureRepository,
        CourseMapper courseMapper,
        SectionRepository sectionRepository,
        CourseRepository courseRepository, QuizzDebounceService quizzDebounceService,
        UserLectureProgressRepository userLectureProgressRepository,
        SecurityHelper securityHelper, UserRepository userRepository,
        RecommendationService recommendationService, 
       LearningPathRepository learningPathRepository
    ) {
        this.lectureRepository = lectureRepository;
        this.courseMapper = courseMapper;
        this.sectionRepository = sectionRepository;
        this.courseRepository = courseRepository;
        this.quizzDebounceService = quizzDebounceService;
        this.userLectureProgressRepository = userLectureProgressRepository;
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.recommendationService = recommendationService;
        this.learningPathRepository = learningPathRepository;
    }

    @Override
    @Transactional
    @CheckCourseOwner
    public SectionResponse create(String courseId, LectureRequest request) {
        Lecture lecture = this.courseMapper.toLecture(request);
        Section section = this.sectionRepository.findById(lecture.getSection().getId())
        .orElseThrow(() -> new ErrorException("Chương học không tốn tại"));
        
        section.setTotalLecture(section.getTotalLecture()+1);
        lecture.setSection(section);
        lecture = this.lectureRepository.save(lecture);
        section.getLectures().add(lecture);
        // gen quizz auto
        quizzDebounceService.schedule(section.getId());
        return this.courseMapper.toSectionResponse(section);
    }

    @Override
    @Transactional
    @CheckCourseOwner
    public SectionResponse delete(String courseId,String id) {
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
        // gen quizz auto
        quizzDebounceService.schedule(section.getId());
        return this.courseMapper.toSectionResponse(section);
    }

    @Override
    @Transactional
    @CheckCourseOwner
    public SectionResponse updatedVideo(String courseId,LectureRequest request) {
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
    public SectionResponse updateName(String courseId,LectureRequest request) {
        Lecture lecture = this.lectureRepository.findById(request.getId())
        .orElseThrow(() -> new ErrorException("Bài học không tồn tại"));
        
        lecture.setName(request.getName());
        lecture = this.lectureRepository.save(lecture);
        // gen quizz auto
        quizzDebounceService.schedule(lecture.getSection().getId());
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
    @UpdateProgress
    public FinishResponse markFinish(String lectureId, boolean finish) {

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new ErrorException("Bài học không tồn tại"));

        String username = securityHelper.getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

        var optional = userLectureProgressRepository.findByUserAndLecture(user, lecture);

        UserLectureProgress progress = optional.orElseGet(() -> {
            UserLectureProgress p = new UserLectureProgress();
            p.setUser(user);
            p.setLecture(lecture);
            return p;
        });

        progress.setIsFinished(finish);

        userLectureProgressRepository.save(progress);

        // trigger AI
        if (finish) {

        Course course = lecture.getSection().getCourse();
        String courseName = course.getName();

        List<Category> categories = course.getCategories();
         
        if (categories != null && !categories.isEmpty()) {


            // load toàn bộ learning path
            List<LearningPath> paths = learningPathRepository.findAllWithSteps();

            // tìm path chứa category này
            LearningPath matchedPath = paths.stream()
            .filter(p -> p.getSteps().stream()
                .anyMatch(step ->
                    categories.stream()
                        .anyMatch(c -> c.getId().equals(step.getCategory().getId()))
                )
            )
            .findFirst()
            .orElse(null);

            if (matchedPath != null) {

                String learningPath = matchedPath.getSteps()
                    .stream()
                    .sorted(Comparator.comparing(LearningPathStep::getStepOrder))
                    .map(step -> step.getStepOrder() + ". " + step.getCategory().getName())
                    .collect(Collectors.joining("\n"));

                recommendationService.analyze(
                        username,
                        courseName,
                        categories,
                        learningPath
                );
            }
        }
    }
        FinishResponse response = new FinishResponse();
        response.setLectureId(lectureId);
        response.setIsFinish(finish);

        return response;
    }
    
    
}
