package com.jwhisper.udemy.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.projection.course.CourseProject;


@Repository
public interface CourseRepository extends JpaRepository<Course, String>, JpaSpecificationExecutor<Course> {
    boolean existsByName(String name);
    Optional<Course> findByIdAndAuthorId(String id, String authorId);
    Page<CourseProject> findAllByIsActiveAndNameContaining(boolean isActive,String name,Pageable pageable);
}
