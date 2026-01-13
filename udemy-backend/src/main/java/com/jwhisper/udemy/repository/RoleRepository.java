package com.jwhisper.udemy.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Role;
import com.jwhisper.udemy.projection.role.RoleProject;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
  Role findByName(String name);
  Page<RoleProject> findAllByIsActiveAndNameContaining(Boolean isActive,String name, Pageable pageable);
}
