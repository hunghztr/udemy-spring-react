package com.jwhisper.udemy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Lecture;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.model.UserLectureProgress;

@Repository
public interface UserLectureProgressRepository extends JpaRepository<UserLectureProgress,String> {
    List<UserLectureProgress> findAllByUserAndLecture_Section_Course(User user, Course course);
    long countByUserAndLecture_Section_CourseAndIsFinishedTrue(User user, Course course);
    Optional<UserLectureProgress> findByUserAndLecture(User user,Lecture lecture);
}
