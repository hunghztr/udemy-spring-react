package com.jwhisper.udemy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Section;

@Repository
public interface SectionRepository extends JpaRepository<Section,String> {
    Optional<Section> findByIdAndCourseId(String id,String courseId);
    void deleteByIdInAndCourseId(List<String> ids, String courseId);
}
