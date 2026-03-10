package com.jwhisper.udemy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Learning;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.model.UserCourseKey;
import java.util.List;
import java.util.Optional;


@Repository
public interface LearningRepository extends JpaRepository<Learning,UserCourseKey> {
    boolean existsByCustomerIdAndCourseId(String customerId, String courseId);
    List<Learning> findByCustomer(User customer);
    List<Learning> findByCustomerAndProgressLessThan(User user, int progress);

    List<Learning> findByCustomerAndProgress(User user, int progress);
    Optional<Learning> findByCustomerAndCourse(User user,Course course);
}
