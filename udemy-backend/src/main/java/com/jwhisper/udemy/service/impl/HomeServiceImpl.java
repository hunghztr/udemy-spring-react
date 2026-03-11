package com.jwhisper.udemy.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryChildResponse;
import com.jwhisper.udemy.dto.category.CategoryCourseResponse;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.dto.course.CourseInfoResponse;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;
import com.jwhisper.udemy.dto.course.FilterRequest;
import com.jwhisper.udemy.elasticsearch.SearchService;
import com.jwhisper.udemy.elasticsearch.document.CourseDocument;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CategoryMapper;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.helper.mapper.ESCourseMapper;
import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.redis.HomeRedisService;
import com.jwhisper.udemy.redis.InterestedRedisService;
import com.jwhisper.udemy.repository.CategoryRepository;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.HomeService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class HomeServiceImpl implements HomeService {
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final HomeRedisService homeRedisService;
    private final InterestedRedisService interestedRedisService;
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ESCourseMapper esCourseMapper;
    private final SecurityHelper securityHelper;
    private final SearchService searchService;
    private final String KEY = "home:categories";
    private final String CHILD_KEY = "home:categories-child";
    public HomeServiceImpl(CourseRepository courseRepository,
         CourseMapper courseMapper, HomeRedisService homeRedisService,
         CategoryRepository categoryRepository, CategoryMapper categoryMapper,
         InterestedRedisService interestedRedisService, ESCourseMapper esCourseMapper,
         SecurityHelper securityHelper, SearchService searchService
         ){ 
         this.homeRedisService = homeRedisService;
         this.categoryMapper = categoryMapper;
         this.interestedRedisService = interestedRedisService;
         this.esCourseMapper = esCourseMapper;
         this.securityHelper = securityHelper;
        this.courseRepository = courseRepository;
        this.courseMapper = courseMapper;
        this.categoryRepository = categoryRepository;
        this.searchService = searchService;
    }
    @Override
    public CourseInfoResponse getCourseDetail(String id) {
        Course course = this.courseRepository.findById(id)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        return this.courseMapper.toCourseInfoResponse(course);
    }
    @Override
    public Pagination<CategoryParentResponse> getAllParents(Pageable pageable, boolean isActive) 
     {
        Pagination<CategoryParentResponse> cPagination = this.homeRedisService.get(this.KEY, 
            new TypeReference<Pagination<CategoryParentResponse>>() {}
        );
        if(cPagination != null){
             return cPagination;
        }
        Page<Category> cPage =
         this.categoryRepository.findAllByIsActiveAndCategoryParentIsNull(isActive, pageable);
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

        return pagination;
    }
    @Override
    public List<CourseSearchResponse> getInterestedCourses() {
        String username = this.securityHelper.getCurrentUsername();
        List<CourseDocument> documents = this.interestedRedisService.getInterestedCourse(username);
        if(!documents.isEmpty()){
            List<CourseSearchResponse> responses = documents.stream()
            .map(c -> this.esCourseMapper.toCourseSearchResponse(c)).toList();
            return responses;
        }
        return this.searchService.getFeaturestCourses();
    }
    @Override
    public Pagination<CourseSearchResponse> getCoursesByCategory(String id,Pageable pageable,
        FilterRequest filterRequest) {
        Category category = this.categoryRepository.findById(id)
        .orElseThrow(() -> new ErrorException("Thể loại không tồn tại"));
        return this.searchService.getCoursesByCategory(category.getName(),pageable, filterRequest);
    }
    @Override
    public List<CategoryCourseResponse> getAllChildren() {
        List<CategoryCourseResponse> cProjections = this.homeRedisService.get(this.CHILD_KEY, 
            new TypeReference<List<CategoryCourseResponse>>() {}
        );
        if(cProjections != null){
             return cProjections;
        }
        Pageable pageable = PageRequest.of(0,10);
        List<Category> categories = categoryRepository.findTopCategories(pageable);
        List<CategoryCourseResponse> responses = categories.stream()
        .map(c -> this.categoryMapper.toCategoryCourseResponse(c)).toList();
        this.homeRedisService.set(this.CHILD_KEY, responses, 1);
        return responses;
    }
}
