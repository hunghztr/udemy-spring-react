package com.jwhisper.udemy.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.course.CourseInfoResponse;
import com.jwhisper.udemy.dto.learning.LearningResponse;
import com.jwhisper.udemy.helper.annotation.CheckLearningOwner;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Learning;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.LearningRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.LearningService;

@Service
public class LearningServiceImpl implements LearningService {
    private final LearningRepository learningRepository;
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;
    private final CourseRepository courseRepository;
    public LearningServiceImpl(LearningRepository learningRepository,
        SecurityHelper securityHelper, UserRepository userRepository,
        CourseMapper courseMapper, CourseRepository courseRepository
    ){
        this.learningRepository = learningRepository;
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
        this.courseRepository = courseRepository;
    }
    @Override
    public List<LearningResponse> getAll(String status) {

        String username = this.securityHelper.getCurrentUsername();

        User user = this.userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng này không tồn tại"));

        List<Learning> learnings;

        switch (status) {
            case "in-progress":
                learnings = learningRepository.findByCustomerAndProgressLessThan(user, 100);
                break;

            case "completed":
                learnings = learningRepository.findByCustomerAndProgress(user, 100);
                break;

            default:
                learnings = learningRepository.findByCustomer(user);
        }

        return learnings.stream().map(learning -> {

            Course course = learning.getCourse();

            LearningResponse response = courseMapper.toLearningResponse(course);
            response.setProgress(learning.getProgress());

            return response;

        }).toList();
    }
    @Override
    @CheckLearningOwner
    public CourseInfoResponse learning(String courseId) {
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        return this.courseMapper.toCourseInfoResponse(course);
    }
}