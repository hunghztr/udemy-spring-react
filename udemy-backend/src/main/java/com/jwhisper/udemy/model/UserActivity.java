package com.jwhisper.udemy.model;

import java.time.Instant;

import com.jwhisper.udemy.helper.constant.ActivityAction;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users_activity")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String username;

    @Enumerated(EnumType.STRING)
    ActivityAction action;

    String resource;     // COURSE, USER, PAYMENT
    String resourceId;   // courseId, userId,...

    Instant createdAt;

    @Override
    public String toString() {
        return "UserActivity [id=" + id + ", username=" + username + ", action=" + action + ", resource=" + resource
                + ", resourceId=" + resourceId + ", createdAt=" + createdAt + "]";
    }
    
}
