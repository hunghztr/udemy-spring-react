package com.jwhisper.udemy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.UserActivity;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity,String> {
    
}
