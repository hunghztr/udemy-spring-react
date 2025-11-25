package com.jwhisper.udemy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
  Role findByName(String name);
}
