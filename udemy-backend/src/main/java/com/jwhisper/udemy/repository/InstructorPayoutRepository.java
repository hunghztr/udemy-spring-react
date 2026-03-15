package com.jwhisper.udemy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.InstructorPayout;
import com.jwhisper.udemy.model.User;

@Repository
public interface InstructorPayoutRepository extends JpaRepository<InstructorPayout,String> {
    List<InstructorPayout> findAllByInstructor(User instructor);
}
