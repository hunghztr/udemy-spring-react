package com.jwhisper.udemy.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Course;


@Repository
public interface CourseRepository extends JpaRepository<Course, String>, JpaSpecificationExecutor<Course> {
    boolean existsByName(String name);
    Optional<Course> findByIdAndAuthorId(String id, String authorId);
}
