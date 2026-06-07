package com.jwhisper.udemy.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.SliceResponse;
import com.jwhisper.udemy.dto.course.CourseInfoResponse;
import com.jwhisper.udemy.dto.learning.LearningResponse;
import com.jwhisper.udemy.dto.rating.RatingRequest;
import com.jwhisper.udemy.dto.rating.RatingResponse;
import com.jwhisper.udemy.elasticsearch.SearchService;
import com.jwhisper.udemy.helper.annotation.CheckLearningOwner;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.helper.mapper.RatingMapper;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Learning;
import com.jwhisper.udemy.model.Quizz;
import com.jwhisper.udemy.model.Rating;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.model.UserCourseKey;
import com.jwhisper.udemy.model.UserLectureProgress;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.LearningRepository;
import com.jwhisper.udemy.repository.QuizzRepository;
import com.jwhisper.udemy.repository.RatingRepository;
import com.jwhisper.udemy.repository.UserLectureProgressRepository;
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
    private final RatingRepository ratingRepository;
    private final RatingMapper ratingMapper;
    private final UserLectureProgressRepository userLectureProgressRepository;
    private final QuizzRepository quizzRepository;
    private final SearchService searchService;
    public LearningServiceImpl(LearningRepository learningRepository,
        SecurityHelper securityHelper, UserRepository userRepository,
        CourseMapper courseMapper, CourseRepository courseRepository,
        RatingRepository ratingRepository, RatingMapper ratingMapper,
        UserLectureProgressRepository userLectureProgressRepository,
        QuizzRepository quizzRepository, SearchService searchService
    ){
        this.learningRepository = learningRepository;
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
        this.courseRepository = courseRepository;
        this.ratingRepository = ratingRepository;
        this.ratingMapper = ratingMapper;
        this.userLectureProgressRepository = userLectureProgressRepository;
        this.quizzRepository = quizzRepository;
        this.searchService = searchService;
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

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));

        String username = securityHelper.getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

        // lấy progress của user
        List<UserLectureProgress> progresses =
                userLectureProgressRepository
                        .findAllByUserAndLecture_Section_Course(user, course);

        // convert sang map để lookup nhanh
        Map<String, Boolean> progressMap =
                progresses.stream()
                        .collect(Collectors.toMap(
                                p -> p.getLecture().getId(),
                                UserLectureProgress::getIsFinished
                        ));

        CourseInfoResponse response = courseMapper.toCourseInfoResponse(course);

        // inject isFinished vào lecture response
        response.getSections().forEach(section ->
                section.getLectures().forEach(lecture -> {

                    boolean finished = progressMap.getOrDefault(lecture.getId(), false);

                    lecture.setIsFinished(finished);
                })
        );

        return response;
    }
    @Override
    public SliceResponse<RatingResponse> getRatings(String courseId, Pageable pageable) {
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        Slice<Rating> page = this.ratingRepository.findByCourse(course,pageable);
        List<RatingResponse> responses = page.stream().map(r -> this.ratingMapper.toRatingResponse(r)).toList();
        
        SliceResponse<RatingResponse> slice = new SliceResponse<>();
        slice.setItems(responses);
        slice.setHasNext(page.hasNext());
        return slice;
    }
    @Override
    public RatingResponse createRating(RatingRequest request,String courseId) {
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        String username = this.securityHelper.getCurrentUsername();
        User user = this.userRepository.findByUsername(username)
        .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));
        UserCourseKey key = new UserCourseKey();
        key.setCourseId(courseId);
        key.setUserId(user.getId());
        // 1 user chỉ được rate 1 lần 1 khoá học
        boolean exist = this.ratingRepository.existsById(key);
        if(exist) throw new ErrorException("Bạn đã đánh giá khoá học này rồi");
        Rating rating = this.ratingMapper.toRating(request);
        rating.setId(key);
        rating.setCourse(course);
        rating.setCustomer(user);
        rating = this.ratingRepository.save(rating);
        Double avgStar = this.ratingRepository.getAverageStar(courseId);
        course.setStar(avgStar != null ? avgStar : 0.0);
        this.courseRepository.save(course);
        this.searchService.indexCourse(course.getId());
        return this.ratingMapper.toRatingResponse(rating);
    }
    @Override
    public long countRatings(String courssId) {
        Course course = this.courseRepository.findById(courssId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        return this.ratingRepository.countByCourse(course);
    }
    @Override
    public void delete(String userId, String courseId) {
        UserCourseKey key = new UserCourseKey();
        key.setCourseId(courseId);
        key.setUserId(userId);
        this.ratingRepository.deleteById(key);
    }
    @Override
    public RatingResponse getByUserAndCourse(String userId,String courseId) {
        User user = this.userRepository.findById(userId)
        .orElseThrow(() -> new ErrorException("Người dùng này không tồn tại"));
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        Rating rating = this.ratingRepository.findByCustomerAndCourse(user,course);
        return this.ratingMapper.toRatingResponse(rating);
    }
    @Override
    public List<Quizz> getQuizsBySection(String sectionId) {
        List<Quizz> quizzs = this.quizzRepository.findAllBySectionId(sectionId);
        return quizzs;
    }
}