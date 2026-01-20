package com.jwhisper.udemy.service.impl;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryChildResponse;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.dto.category.CategoryRequest;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CategoryMapper;
import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.projection.category.CategoryProjection;
import com.jwhisper.udemy.repository.CategoryRepository;
import com.jwhisper.udemy.service.CategoryService;
import com.jwhisper.udemy.service.HomeRedisService;

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
    public Pagination<CategoryProjection> getAll(Pageable pageable,boolean isActive, String name) throws ErrorException {
        Page<CategoryProjection> cPage =
         this.categoryRepository.findAllByIsActiveAndNameContaining(isActive, name, pageable);
         if(cPage.getContent() == null || cPage.getContent().size() == 0){
            throw new ErrorException("Danh sách danh mục rỗng");
         }
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
    public boolean create(CategoryRequest request) throws ErrorException {
        if(this.categoryRepository.existsByName(request.getName())){
            throw new ErrorException("Danh mục này đã tồn tại");
        }
        Category category = this.categoryMapper.toCategory(request);
        this.categoryRepository.save(category);
        this.homeRedisService.delete(this.KEY);
        return true;
    }
    @Override
    public boolean update(CategoryRequest request) throws ErrorException {
        if(this.categoryRepository.existsByNameAndIdNot(request.getName(), request.getId())){
            throw new ErrorException("Name đã có danh mục dùng");
        }
        Optional<Category> optional = this.categoryRepository.findById(request.getId());
        if(!optional.isPresent() || !optional.get().isActive()){
            throw new ErrorException("Danh mục không tồn tại hoặc đã bị vô hiệu hoá");
        }
        Category category = optional.get();
        category.setName(request.getName());
        category.getCategoryParent().setId(request.getCategoryParent().getId());
        this.categoryRepository.save(category);
        this.homeRedisService.delete(this.KEY);
        return true;
    }
    @Override
    public CategoryProjection get(String id) throws ErrorException {
        CategoryProjection categoryProjection = this.categoryRepository.findProjectById(id);
        if(categoryProjection == null) throw new ErrorException("Danh mục không tồn tại");
        return categoryProjection;
    }
    @Override
    public boolean delete(String id) throws ErrorException {
        var optional = this.categoryRepository.findById(id);
        if(!optional.isPresent() || !optional.get().isActive()){
            throw new ErrorException("Danh mục không tồn tại hoặc đã bị vô hiệu hoá");
        }
        Category category = optional.get();
        category.setActive(false);
        this.categoryRepository.save(category);
        this.homeRedisService.delete(this.KEY);
        return true;
    }
    @Override
    public boolean activate(String id) throws ErrorException {
        var optional = this.categoryRepository.findById(id);
        if(!optional.isPresent() || optional.get().isActive()){
            throw new ErrorException("Danh mục không tồn tại hoặc đã chưa bị vô hiệu hoá");
        }
        Category category = optional.get();
        category.setActive(true);
        this.categoryRepository.save(category);
        this.homeRedisService.delete(this.KEY);
        return true;
    }
    @Override
    public Pagination<CategoryParentResponse> getAllParents(Pageable pageable, boolean isActive) 
    throws ErrorException {
        long start = System.currentTimeMillis();
        Pagination<CategoryParentResponse> cPagination = this.homeRedisService.get(this.KEY, 
            new TypeReference<Pagination<CategoryParentResponse>>() {}
        );
        if(cPagination != null){
            long end = System.currentTimeMillis();
            log.info(">>> GET FROM REDIS: {} ms", (end - start));
             return cPagination;
        }
        long dbStart = System.currentTimeMillis();
        Page<Category> cPage =
         this.categoryRepository.findAllByIsActiveAndCategoryParentIsNull(isActive, pageable);
         if(cPage.getContent() == null || cPage.getContent().size() == 0){
            throw new ErrorException("Danh sách danh mục rỗng");
         }
         List<CategoryParentResponse> categoryResponses = cPage.getContent()
         .stream().map(c -> this.categoryMapper.toParentCategoryResponse(c)).toList();
         // lấy list con
         categoryResponses.forEach(c -> {
            Page<Category> childPage = this.categoryRepository
            .findAllByCategoryParentId(c.getId(),PageRequest.of(0,10, Sort.by("createdAt").ascending()));
            List<CategoryChildResponse> children = childPage.getContent().stream()
            .map(child -> this.categoryMapper.toChildCategoryResponse(child)).toList();
            c.setCategories(children);
         });
        Pagination<CategoryParentResponse> pagination = new Pagination<>();
        pagination.setElements(categoryResponses);
        Pagination.Meta meta = new Pagination.Meta();
        meta.setPageSize(cPage.getSize());
        meta.setCurrentPage(cPage.getNumber());
        meta.setElementTotals(cPage.getTotalElements());
        meta.setPageTotals(cPage.getTotalPages());
        pagination.setMeta(meta);
        this.homeRedisService.set(this.KEY, pagination, 1);

        long dbEnd = System.currentTimeMillis();
        log.info(">>> GET FROM DB: {} ms", (dbEnd - dbStart));
        return pagination;
    }
    @Override
    public List<CategoryProjection> getAllNoPage() throws ErrorException {
        return this.categoryRepository.findAllBy();
    }
    
}
