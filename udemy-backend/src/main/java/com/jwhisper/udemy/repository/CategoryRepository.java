package com.jwhisper.udemy.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.projection.category.CategoryProjection;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Page<CategoryProjection> findAllByIsActiveAndNameContaining
    (Boolean isActive, String name, Pageable pageable);
}
