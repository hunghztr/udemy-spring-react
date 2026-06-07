package com.jwhisper.udemy.service.impl;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryRequest;
import com.jwhisper.udemy.dto.category.CategoryStudentResponse;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CategoryMapper;
import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.projection.category.CategoryCourseProjection;
import com.jwhisper.udemy.projection.category.CategoryProjection;
import com.jwhisper.udemy.projection.category.CategoryStudentProjection;
import com.jwhisper.udemy.redis.HomeRedisService;
import com.jwhisper.udemy.repository.CategoryRepository;
import com.jwhisper.udemy.service.CategoryService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final HomeRedisService homeRedisService;
    private final String KEY = "home:categories";
    public CategoryServiceImpl(CategoryRepository categoryRepository,
        CategoryMapper categoryMapper,
        HomeRedisService homeRedisService
    ) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
        this.homeRedisService = homeRedisService;
    }
    @Override
    public Pagination<CategoryProjection> getAll(Pageable pageable,boolean isActive, String name)  {
        Page<CategoryProjection> cPage =
         this.categoryRepository.findAllByIsActiveAndNameContaining(isActive, name, pageable);
        Pagination<CategoryProjection> pagination = new Pagination<>();
        pagination.setElements(cPage.getContent());
        Pagination.Meta meta = new Pagination.Meta();
        meta.setPageSize(cPage.getSize());
        meta.setCurrentPage(cPage.getNumber());
        meta.setElementTotals(cPage.getTotalElements());
        meta.setPageTotals(cPage.getTotalPages());
        pagination.setMeta(meta);
        return pagination;
    }
    @Override
    public boolean create(CategoryRequest request)  {
        if(this.categoryRepository.existsByName(request.getName())){
            throw new ErrorException("Danh mục này đã tồn tại");
        }
        Category category = this.categoryMapper.toCategory(request);
        this.categoryRepository.save(category);
        this.homeRedisService.delete(this.KEY);
        return true;
    }
    @Override
    public boolean update(CategoryRequest request)  {
        if(this.categoryRepository.existsByNameAndIdNot(request.getName(), request.getId())){
            throw new ErrorException("Name đã có danh mục dùng");
        }
        Optional<Category> optional = this.categoryRepository.findById(request.getId());
        if(!optional.isPresent() || !optional.get().getIsActive()){
            throw new ErrorException("Danh mục không tồn tại hoặc đã bị vô hiệu hoá");
        }
        Category category = optional.get();
        category.setName(request.getName());
        Category parent = new Category();
        parent.setId(request.getCategoryParent().getId());
        category.setCategoryParent(parent);
        this.categoryRepository.save(category);
        this.homeRedisService.delete(this.KEY);
        return true;
    }
    @Override
    public CategoryProjection get(String id)  {
        CategoryProjection categoryProjection = this.categoryRepository.findProjectById(id);
        if(categoryProjection == null) throw new ErrorException("Danh mục không tồn tại");
        return categoryProjection;
    }
    @Override
    public boolean delete(String id)  {
        var optional = this.categoryRepository.findById(id);
        if(!optional.isPresent() || !optional.get().getIsActive()){
            throw new ErrorException("Danh mục không tồn tại hoặc đã bị vô hiệu hoá");
        }
        Category category = optional.get();
        category.setIsActive(false);
        this.categoryRepository.save(category);
        this.homeRedisService.delete(this.KEY);
        return true;
    }
    @Override
    public boolean activate(String id)  {
        var optional = this.categoryRepository.findById(id);
        if(!optional.isPresent() || optional.get().getIsActive()){
            throw new ErrorException("Danh mục không tồn tại hoặc đã chưa bị vô hiệu hoá");
        }
        Category category = optional.get();
        category.setIsActive(true);
        this.categoryRepository.save(category);
        this.homeRedisService.delete(this.KEY);
        return true;
    }
    
    @Override
    public List<CategoryProjection> getAllNoPage()  {
        return this.categoryRepository.findAllBy();
    }
    @Override
    public List<CategoryCourseProjection> getByDashBoard() {
        return this.categoryRepository.findCategoryWithCourseCount();
    }
    @Override
    public List<CategoryStudentResponse> getByMonths(String categoryId) {

        List<CategoryStudentProjection> raw = categoryRepository
            .getStudentByMonth(categoryId);

        Map<Integer, Long> map = raw.stream()
            .collect(Collectors.toMap(
                CategoryStudentProjection::getMonth,
                CategoryStudentProjection::getStudents
            ));

        List<CategoryStudentResponse> result = new ArrayList<>();

        for (int i = 1; i <= 12; i++) {
            CategoryStudentResponse item = new CategoryStudentResponse();
            item.setMonth(i);
            item.setStudents(map.getOrDefault(i, 0L).intValue());
            item.setId(categoryId); // optional
            result.add(item);
        }

        return result;
    }
    
}
