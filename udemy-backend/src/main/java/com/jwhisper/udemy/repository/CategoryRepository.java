package com.jwhisper.udemy.repository;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.projection.category.CategoryProjection;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name,String id);
    Page<CategoryProjection> findAllByIsActiveAndNameContaining
    (Boolean isActive, String name, Pageable pageable);
    Page<Category> findAllByIsActiveAndCategoryParentIsNull(Boolean isActive,Pageable pageable);
    Page<Category> findAllByCategoryParentId(String parentId,Pageable pageable);
    CategoryProjection findProjectById(String id);
    List<CategoryProjection> findAllBy();
    @Query("""
    SELECT c
    FROM Course co
    JOIN co.categories c
    GROUP BY c
    ORDER BY COUNT(co.id) DESC
    """)
    List<Category> findTopCategories(Pageable pageable);
}
