package com.jwhisper.udemy.service.impl;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseDetailResponse;
import com.jwhisper.udemy.dto.course.CourseRequest;
import com.jwhisper.udemy.dto.course.CourseResponse;

import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CategoryMapper;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.model.Course;

import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.CourseRepository;

import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.CourseService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    public CourseServiceImpl(CourseRepository courseRepository,
        CategoryMapper categoryMapper,
        SecurityHelper securityHelper,
        UserRepository userRepository,
        CourseMapper courseMapper
    ){
        this.courseRepository = courseRepository;
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
    }
    @Override
    public boolean isCreated(CourseRequest request) throws ErrorException {
        if(this.courseRepository.existsByName(request.getName())){
            throw new ErrorException("Tên khoá học đã tồn tại");
        }
        Course course = new Course();
        course.setName(request.getName());
        String username = this.securityHelper.getCurrentUsername();
        var user = this.userRepository.findProjectByUsername(username);
        User author = new User();
        author.setId(user.getId());
        course.setAuthor(author);
        List<Category> categories = new ArrayList<>();
        for(int i = 0 ; i < request.getCategoriesId().size() ; i++){
            Category category = new Category();
            category.setId(request.getCategoriesId().get(i));
            categories.add(category);
        }
        course.setCategories(categories);
        this.courseRepository.save(course);
        return true;
    }
    @Override
    public Pagination<CourseResponse> getAllByAuthor(Specification<Course> spec, Pageable pageable)
            throws ErrorException {
        String username = securityHelper.getCurrentUsername();
    var user = userRepository.findProjectByUsername(username);
    Specification<Course> authorSpec = (root, query, cb) ->
            cb.equal(root.get("author").get("id"), user.getId());

    Specification<Course> finalSpec =
            (spec == null) ? authorSpec : spec.and(authorSpec);
        Page<Course> pageCourses = this.courseRepository.findAll(finalSpec, pageable);
        if(pageCourses.getContent() == null || pageCourses.getContent().size() == 0){
            throw new ErrorException("Không có khoá học");
        }
        Pagination<CourseResponse> pagination = new Pagination<>();
        Pagination.Meta meta = new Pagination.Meta();
        meta.setPageSize(pageable.getPageSize());
        meta.setCurrentPage(pageable.getPageNumber());
        meta.setPageTotals(pageCourses.getTotalPages());
        meta.setElementTotals(pageCourses.getTotalElements());
        pagination.setMeta(meta);
        List<CourseResponse> courseResponses = pageCourses.getContent().stream()
        .map(c -> this.courseMapper.toCourseResponse(c)).toList();
        pagination.setElements(courseResponses);
        return pagination;
    }
    @Override
    public CourseDetailResponse getDetail(String id) throws ErrorException {
        String username = this.securityHelper.getCurrentUsername();
        var user = this.userRepository.findProjectByUsername(username);
        Optional<Course> optional = this.courseRepository.findByIdAndAuthorId(id,user.getId());
        if(!optional.isPresent()) throw new ErrorException("Không tìm thấy khoá học");
        CourseDetailResponse detailResponse = this.courseMapper.toCourseDetailResponse(optional.get());
        return detailResponse;
    }
    @Override
    public boolean isDescriptionUpdated(CourseRequest request) throws ErrorException {
        String username = this.securityHelper.getCurrentUsername();
        var user = this.userRepository.findProjectByUsername(username);
        Optional<Course> optional = this.courseRepository.findByIdAndAuthorId(request.getId(), user.getId());
        if(!optional.isPresent()) throw new ErrorException(("Không tìm thấy khoá học"));
        Course course = optional.get();
  
        course.setDescription(request.getDescription());
        course.setRequirement(request.getRequirement());

        courseRepository.save(course);

        return true;
    }
}
