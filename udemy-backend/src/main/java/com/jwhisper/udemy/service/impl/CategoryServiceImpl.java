package com.jwhisper.udemy.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.projection.category.CategoryProjection;
import com.jwhisper.udemy.repository.CategoryRepository;
import com.jwhisper.udemy.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    @Override
    public Pagination<CategoryProjection> getAll(Pageable pageable,boolean isActive, String name) {
        Page<CategoryProjection> cPage =
         this.categoryRepository.findAllByIsActiveAndNameContaining(isActive, name, pageable);
        Pagination<CategoryProjection> pagination = new Pagination<>();
        Pagination.Meta meta = new Pagination.Meta();
        meta.setPageSize(cPage.getSize());
        meta.setCurrentPage(cPage.getNumber());
        meta.setElementTotals(cPage.getTotalElements());
        meta.setPageTotals(cPage.getTotalPages());
        pagination.setMeta(meta);
        return pagination;
    }
    
}
