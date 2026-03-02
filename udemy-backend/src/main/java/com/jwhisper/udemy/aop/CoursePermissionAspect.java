package com.jwhisper.udemy.aop;

import java.util.Optional;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;

@Aspect
@Component
public class CoursePermissionAspect {
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public CoursePermissionAspect(SecurityHelper securityHelper,
                                  UserRepository userRepository,
                                  CourseRepository courseRepository) {
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }
    @Before("@annotation(CheckCourseOwner)")
    public void checkOwner(JoinPoint joinPoint) {

        String courseId = (String) joinPoint.getArgs()[0];
        String username = securityHelper.getCurrentUsername();

        var user = userRepository.findProjectByUsername(username);
        if (user == null) {
            throw new ErrorException("Người dùng không tồn tại");
        }
        Optional<Course> optional = this.courseRepository.findByIdAndAuthorId(courseId, user.getId());
        if(optional.isEmpty()) throw new ErrorException("Khoá học này không thuộc về bạn");
    }
}
