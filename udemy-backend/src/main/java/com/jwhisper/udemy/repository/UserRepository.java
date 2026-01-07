package com.jwhisper.udemy.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.user.UserDetail;
import com.jwhisper.udemy.projection.user.UserProject;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
  @Query("SELECT u FROM User u WHERE BINARY(u.username) = :username")
  Optional<User> findByUsername(String username);

  boolean existsByUsername(String username);

  UserDetail findProjectByUsername(String username);
  UserProject findProjectById(String id);
  Page<UserProject> findAllUsersByIsActive(Boolean isActive, Pageable pageable);
}
