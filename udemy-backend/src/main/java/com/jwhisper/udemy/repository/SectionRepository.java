package com.jwhisper.udemy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Section;

@Repository
public interface SectionRepository extends JpaRepository<Section,String> {
    @Query("""
        SELECT COALESCE(SUM(s.hour), 0)
        FROM Section s
        WHERE s.course.id = :courseId
    """)
    Double sumHourByCourseId(String courseId);
    Optional<Section> findByIdAndCourseId(String id,String courseId);
    void deleteByIdInAndCourseId(List<String> ids, String courseId);
}
