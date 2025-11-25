package com.jwhisper.udemy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {

}
