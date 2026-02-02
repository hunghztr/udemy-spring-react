package com.jwhisper.udemy.service.impl;


import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseDetailResponse;
import com.jwhisper.udemy.dto.course.CourseRequest;
import com.jwhisper.udemy.dto.course.CourseResponse;
import com.jwhisper.udemy.helper.constant.CourseStatus;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CategoryMapper;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.model.Course;

import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.course.CourseProject;
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
    public boolean isCreated(CourseRequest request)  {
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
        course.setIsActive(false);
        course.setStatus(CourseStatus.PENDING);
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
    public Pagination<CourseResponse> getAllByAuthor(Specification<Course> spec, Pageable pageable){
        String username = securityHelper.getCurrentUsername();
        var user = userRepository.findProjectByUsername(username);
        Specification<Course> authorSpec = (root, query, cb) ->
            cb.equal(root.get("author").get("id"), user.getId());

        Specification<Course> finalSpec =
            (spec == null) ? authorSpec : spec.and(authorSpec);
        Page<Course> pageCourses = this.courseRepository.findAll(finalSpec, pageable);
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
    public Pagination<CourseProject> getAll(Pageable pageable,boolean isActive, String keyword) {
        Page<CourseProject> pageCourses = this.courseRepository.findAllByIsActiveAndNameContaining(isActive,keyword, pageable);
        Pagination<CourseProject> pagination = new Pagination<>();
        Pagination.Meta meta = new Pagination.Meta();
        meta.setPageSize(pageable.getPageSize());
        meta.setCurrentPage(pageable.getPageNumber());
        meta.setPageTotals(pageCourses.getTotalPages());
        meta.setElementTotals(pageCourses.getTotalElements());
        pagination.setMeta(meta);
        pagination.setElements(pageCourses.getContent());
        return pagination;
    }
    @Override
    public CourseDetailResponse getDetail(String id)  {
        String permission = this.securityHelper.getCurrentPermission();
        Course course = new Course();
        if(permission.equals("ADMIN")){
            course = this.courseRepository.findById(id)
            .orElseThrow(() -> new ErrorException("Khoá học được lấy bởi admin không tồn tại"));
        }else{
            course = this.securityHelper.checkCourseUser(id);
        }
        CourseDetailResponse detailResponse = this.courseMapper.toCourseDetailResponse(course);
        return detailResponse;
    }
    @Override
    public boolean isDescriptionUpdated(CourseRequest request)  {
        Course course = this.securityHelper.checkCourseUser(request.getId());
        course.setDescription(request.getDescription());
        course.setRequirement(request.getRequirement());

        courseRepository.save(course);

        return true;
    }
    @Override
    public boolean isImageUpdate(CourseRequest request) {
        Course course = this.securityHelper.checkCourseUser(request.getId());
        course.setImagePath(request.getImagePath());
        this.courseRepository.save(course);
        return true;
    }
    @Override
    public boolean isPriceUpdated(CourseRequest request) {
        Course course = this.securityHelper.checkCourseUser(request.getId());
        course.setPrice(request.getPrice());
        this.courseRepository.save(course);
        return true;
    }
    @Override
    public boolean delete(String id)  {
        var optional = this.courseRepository.findById(id);
        if(!optional.isPresent() || !optional.get().getIsActive()){
            throw new ErrorException("Khoá học không tồn tại hoặc đã bị vô hiệu hoá");
        }
        Course course = optional.get();
        course.setIsActive(false);
        course.setStatus(CourseStatus.REJECTED);
        this.courseRepository.save(course);
        return true;
    }

  @Override
  public boolean active(String id)  {
    var optional = this.courseRepository.findById(id);
    if(!optional.isPresent() || optional.get().getIsActive()){
        throw new ErrorException("Khoá học không tồn tại hoặc đã chưa bị vô hiệu hoá");
    }
    Course course = optional.get();
    course.setIsActive(true);
    course.setStatus(CourseStatus.PUBLISHED);
    this.courseRepository.save(course);
    return true;
  }
    
}
