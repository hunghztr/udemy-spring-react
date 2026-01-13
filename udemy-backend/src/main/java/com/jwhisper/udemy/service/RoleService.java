package com.jwhisper.udemy.service;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.projection.role.RoleProject;

public interface RoleService {
    Pagination<RoleProject> getAll(Pageable pageable, boolean isActive, String keyword) throws ErrorException;
}
