package com.jwhisper.udemy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.LearningPathStep;

@Repository
public interface LearningPathStepRepository extends JpaRepository<LearningPathStep,String> {
    List<LearningPathStep> findByLearningPathIdOrderByStepOrder(String pathId);
}
