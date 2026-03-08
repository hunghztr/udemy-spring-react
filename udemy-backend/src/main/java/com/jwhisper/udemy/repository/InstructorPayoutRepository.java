package com.jwhisper.udemy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.InstructorPayout;

@Repository
public interface InstructorPayoutRepository extends JpaRepository<InstructorPayout,String> {
    
}
