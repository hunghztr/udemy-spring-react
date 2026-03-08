package com.jwhisper.udemy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Learning;
import com.jwhisper.udemy.model.UserCourseKey;

@Repository
public interface LearningRepository extends JpaRepository<Learning,UserCourseKey> {
    boolean existsByCustomerIdAndCourseId(String customerId, String courseId);
}
