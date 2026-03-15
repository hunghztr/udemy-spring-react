package com.jwhisper.udemy.aop;

import java.util.Optional;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Learning;
import com.jwhisper.udemy.model.Lecture;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.LearningRepository;
import com.jwhisper.udemy.repository.LectureRepository;
import com.jwhisper.udemy.repository.UserLectureProgressRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import lombok.extern.slf4j.Slf4j;

@Aspect
@Slf4j
@Component
public class CheckingAspect {
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LearningRepository learningRepository;
    private final LectureRepository lectureRepository;
    private final UserLectureProgressRepository userLectureProgressRepository;
    public CheckingAspect(SecurityHelper securityHelper,
                                  UserRepository userRepository,
                                  CourseRepository courseRepository,
                                LearningRepository learningRepository,
                            LectureRepository lectureRepository,
                        UserLectureProgressRepository userLectureProgressRepository) {
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.learningRepository = learningRepository;
        this.lectureRepository = lectureRepository;
        this.userLectureProgressRepository = userLectureProgressRepository;
    }
    @Before("@annotation(com.jwhisper.udemy.helper.annotation.CheckCourseOwner)")
    public void checkCourseOwner(JoinPoint joinPoint) {
        String courseId = (String) joinPoint.getArgs()[0];
        String username = securityHelper.getCurrentUsername();

        var user = userRepository.findProjectByUsername(username);
        

        if (user == null) {
            throw new ErrorException("Người dùng không tồn tại");
        }
        if(user.getRoleName().equals("ADMIN")) return;
        Optional<Course> optional = this.courseRepository.findByIdAndAuthorId(courseId, user.getId());
        if(optional.isEmpty()) throw new ErrorException("Khoá học này không thuộc về bạn");
    }
    @Before("@annotation(com.jwhisper.udemy.helper.annotation.CheckCartOwner)")
    public void checkCartOwner() {

        String username = securityHelper.getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

        if (user.getCart() == null) {
            throw new ErrorException("Giỏ hàng không tồn tại");
        }
    }
    @Before("@annotation(com.jwhisper.udemy.helper.annotation.CheckLearningOwner)")
    public void checkLearningOwner(JoinPoint joinPoint) {

        String courseId = (String) joinPoint.getArgs()[0];
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        String username = this.securityHelper.getCurrentUsername();
        User user = this.userRepository.findByUsername(username)
        .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));
        Optional<Learning> optional = this.learningRepository.findByCustomerAndCourse(user, course);
        if(optional.isEmpty()) throw new ErrorException("Người dùng này chưa sở hữu khoá học");
    }
    @AfterReturning(
        value = "@annotation(com.jwhisper.udemy.helper.annotation.UpdateProgress)",
        returning = "response"
    )
    public void updateProgressAfterFinish(JoinPoint joinPoint, Object response) {

        String lectureId = (String) joinPoint.getArgs()[0];

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new ErrorException("Lecture không tồn tại"));

        updateProgress(lecture);
    }
    public void updateProgress(Lecture lecture){

        Course course = lecture.getSection().getCourse();

        String username = securityHelper.getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

        Learning learning = learningRepository
                .findByCustomerAndCourse(user, course)
                .orElseThrow(() -> new ErrorException("Learning không tồn tại"));

        long finished = userLectureProgressRepository
                .countByUserAndLecture_Section_CourseAndIsFinishedTrue(user, course);

        long total = lectureRepository.countBySection_Course(course);

        int progress = 0;

        if (total > 0) {
            progress = (int)((double) finished / total * 100);
        }

        if (learning.getProgress() != progress) {
            learning.setProgress(progress);
            learningRepository.save(learning);
        }
    }
}
