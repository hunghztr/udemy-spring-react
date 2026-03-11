package com.jwhisper.udemy.repository;


import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Rating;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.model.UserCourseKey;

@Repository
public interface RatingRepository extends JpaRepository<Rating,UserCourseKey> {
    Slice<Rating> findByCourse(Course course,Pageable pageable);
    long countByCourse(Course course);
    Rating findByCustomerAndCourse(User user,Course course);
}
