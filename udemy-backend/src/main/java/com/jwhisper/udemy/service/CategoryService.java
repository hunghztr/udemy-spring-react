package com.jwhisper.udemy.service;



import java.util.List;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.dto.category.CategoryRequest;
import com.jwhisper.udemy.projection.category.CategoryProjection;

public interface CategoryService {
    boolean create(CategoryRequest category) ;
    boolean update(CategoryRequest category) ;
    CategoryProjection get(String id) ;
    boolean delete(String id) ;
    boolean activate(String id) ;
    List<CategoryProjection> getAllNoPage() ;
    Pagination<CategoryParentResponse> getAllParents(Pageable pageable, boolean isActive) ;
    Pagination<CategoryProjection> getAll(Pageable pageable, boolean isActive, String name) ;
}
