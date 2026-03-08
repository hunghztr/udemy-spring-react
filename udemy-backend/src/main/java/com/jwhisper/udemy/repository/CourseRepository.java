package com.jwhisper.udemy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.projection.course.CourseProject;


@Repository
public interface CourseRepository extends JpaRepository<Course, String>, JpaSpecificationExecutor<Course> {
    boolean existsByName(String name);
    Optional<Course> findByIdAndAuthorId(String id, String authorId);
    Page<CourseProject> findAllByIsActiveAndNameContaining(boolean isActive,String name,Pageable pageable);
    @Query("""
    select c from Course c
    left join fetch c.categories
    where c.id = :id
    """)
    Optional<Course> findByIdWithCategories(String id);
    List<Course> findByIdIn(List<String> ids);
    @Modifying
    @Query("""
    UPDATE Course c
    SET c.sold = c.sold + 1
    WHERE c.id = :courseId
    """)
    void increaseSold(@Param("courseId") String courseId);
}
