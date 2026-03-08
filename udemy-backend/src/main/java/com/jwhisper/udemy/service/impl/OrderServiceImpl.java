package com.jwhisper.udemy.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.course.CourseResponse;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.OrderService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OrderServiceImpl  implements OrderService{
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;
    public OrderServiceImpl(
        SecurityHelper securityHelper, UserRepository userRepository, CourseMapper courseMapper
    ){
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
    }
    @Override
    public List<CourseResponse> getBoughtCourses(String username) {
        var user = this.userRepository.findByUsername(username)
        .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));
        List<Course> courses = user.getOrders()
        .stream()
        .flatMap(o -> o.getCourses().stream())
        .toList();
        List<CourseResponse> responses = courses.stream().map(c -> this.courseMapper.toCourseResponse(c)).toList();
        return responses;
    }
    @Override
    public boolean checkCourse(List<String> coursesId) {
        String username = this.securityHelper.getCurrentUsername();

        var user = this.userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));
        return user.getOrders().stream()
                .flatMap(o -> o.getCourses().stream())
                .anyMatch(c -> coursesId.contains(c.getId()));
    }
    
}
