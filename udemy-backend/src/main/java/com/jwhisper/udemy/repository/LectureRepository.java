package com.jwhisper.udemy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.Lecture;

@Repository
public interface LectureRepository extends JpaRepository<Lecture,String> {
    @Query("select coalesce(sum(l.second),0) from Lecture l where l.section.id = :id")
    double sumSecondBySectionId(String id);
    Optional<Lecture> findByIdAndSection_Course_Id(String id, String courseId);
    void deleteByIdInAndSection_Course_Id(List<String> ids,String courseId);
    long countBySection_Course(Course course);
}
