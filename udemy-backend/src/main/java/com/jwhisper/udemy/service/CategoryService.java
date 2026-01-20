package com.jwhisper.udemy.service;



import java.util.List;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.dto.category.CategoryRequest;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.projection.category.CategoryProjection;

public interface CategoryService {
    boolean create(CategoryRequest category) throws ErrorException;
    boolean update(CategoryRequest category) throws ErrorException;
    CategoryProjection get(String id) throws ErrorException;
    boolean delete(String id) throws ErrorException;
    boolean activate(String id) throws ErrorException;
    List<CategoryProjection> getAllNoPage() throws ErrorException;
    Pagination<CategoryParentResponse> getAllParents(Pageable pageable, boolean isActive) throws ErrorException;
    Pagination<CategoryProjection> getAll(Pageable pageable, boolean isActive, String name) throws ErrorException;
}
