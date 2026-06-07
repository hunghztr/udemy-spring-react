package com.jwhisper.udemy.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.projection.category.CategoryCourseProjection;
import com.jwhisper.udemy.projection.category.CategoryProjection;
import com.jwhisper.udemy.projection.category.CategoryStudentProjection;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name,String id);
    Page<CategoryProjection> findAllByIsActiveAndNameContaining
    (Boolean isActive, String name, Pageable pageable);
    Page<Category> findAllByIsActiveAndCategoryParentIsNull(Boolean isActive,Pageable pageable);
    Page<Category> findAllByCategoryParentId(String parentId,Pageable pageable);
    CategoryProjection findProjectById(String id);
    List<CategoryProjection> findAllBy();
    @Query("""
    SELECT c.id as id,
        c.name as name,
        COUNT(co.id) as courseCount
    FROM Course co
    JOIN co.categories c
    GROUP BY c.id, c.name
    ORDER BY courseCount DESC
    """)
    List<CategoryCourseProjection> findTopCategories(Pageable pageable);
    @Query("""
    SELECT 
        c.id as id,
        c.name as name,
        COUNT(DISTINCT co.id) as courseCount
    FROM Course co
    JOIN co.categories c
    GROUP BY c.id, c.name
    ORDER BY courseCount DESC
    """)
    List<CategoryCourseProjection> findCategoryWithCourseCount();

    @Query("""
    SELECT 
        MONTH(o.createdAt) as month,
        COUNT(o.id) as students
    FROM Order o
    JOIN o.courses co
    JOIN co.categories c
    WHERE c.id = :categoryId
    GROUP BY MONTH(o.createdAt)
    ORDER BY MONTH(o.createdAt)
    """)
    List<CategoryStudentProjection> getStudentByMonth(
        @Param("categoryId") String categoryId
    );
}
