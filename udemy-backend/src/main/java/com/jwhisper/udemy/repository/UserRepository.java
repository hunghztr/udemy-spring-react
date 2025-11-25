package com.jwhisper.udemy.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
  @Query("SELECT u FROM User u WHERE BINARY(u.username) = :username")
  Optional<User> findByUsername(String username);

  boolean existsByUsername(String username);
}
