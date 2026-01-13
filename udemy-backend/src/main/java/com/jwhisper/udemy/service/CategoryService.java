package com.jwhisper.udemy.service;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.projection.category.CategoryProjection;

public interface CategoryService {
    Pagination<CategoryProjection> getAll(Pageable pageable, boolean isActive, String name);
}
