package com.jwhisper.udemy.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,String> {
    Slice<Notification> findAllByUser_Id(String userId,Pageable pageable);
}
