package com.jwhisper.udemy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.LearningPath;

@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath,String> {
    Optional<LearningPath> findByName(String name);
    @Query("""
        SELECT DISTINCT lp
        FROM LearningPath lp
        LEFT JOIN FETCH lp.steps s
        LEFT JOIN FETCH s.category
    """)
    List<LearningPath> findAllWithSteps();
}
