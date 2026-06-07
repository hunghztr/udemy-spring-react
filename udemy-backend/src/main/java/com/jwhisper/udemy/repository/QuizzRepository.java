package com.jwhisper.udemy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Quizz;

@Repository
public interface QuizzRepository extends JpaRepository<Quizz,String> {
    List<Quizz> findAllBySectionId(String sectionId);
    void deleteBySectionId(String sectionId);
    
}