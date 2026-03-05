package com.jwhisper.udemy.service.impl;


import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseDetailResponse;
import com.jwhisper.udemy.dto.course.CourseRequest;
import com.jwhisper.udemy.dto.course.CourseResponse;
import com.jwhisper.udemy.elasticsearch.SearchService;
import com.jwhisper.udemy.helper.annotation.CheckCourseOwner;
import com.jwhisper.udemy.helper.annotation.LogActivity;
import com.jwhisper.udemy.helper.constant.ActivityAction;
import com.jwhisper.udemy.helper.constant.CourseStatus;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CategoryMapper;
import com.jwhisper.udemy.helper.mapper.CourseMapper;
import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.model.Course;

import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.course.CourseProject;
import com.jwhisper.udemy.repository.CategoryRepository;
import com.jwhisper.udemy.repository.CourseRepository;

import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.CourseService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseMapper courseMapper;
    private final SearchService searchService;
    private final ObjectMapper objectMapper;
    public CourseServiceImpl(CourseRepository courseRepository,
        CategoryMapper categoryMapper,
        SecurityHelper securityHelper,
        UserRepository userRepository,
        CourseMapper courseMapper,
        SearchService searchService,
        CategoryRepository categoryRepository,
        ObjectMapper objectMapper
    ){
        this.courseRepository = courseRepository;
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
        this.searchService = searchService;
        this.categoryRepository = categoryRepository;
        this.objectMapper = objectMapper;
    }
    @Override
    @Transactional
    @LogActivity(action = ActivityAction.CREATE_COURSE, resource = "Course")
    public CourseResponse create(CourseRequest request)  {
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
            Category category = this.categoryRepository.findById(request.getCategoriesId().get(i))
            .orElseThrow(() -> new ErrorException("Danh mục không tồn tại"));
            categories.add(category);
        }
        course.setCategories(categories);
        this.courseRepository.save(course);
        
        return this.courseMapper.toCourseResponse(course);
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
    @CheckCourseOwner
    public CourseDetailResponse getDetail(String id)  {
        String permission = this.securityHelper.getCurrentPermission();
        Course course = new Course();
        if(permission.equals("ADMIN")){
            course = this.courseRepository.findById(id)
            .orElseThrow(() -> new ErrorException("Khoá học được lấy bởi admin không tồn tại"));
        }else{
            course = this.courseRepository.findById(id)
            .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        }
        CourseDetailResponse detailResponse = this.courseMapper.toCourseDetailResponse(course);
        return detailResponse;
    }
    @Override
    @CheckCourseOwner
    @LogActivity(action = ActivityAction.UPDATE_COURSE, resource = "Course")
    public CourseResponse updateDesc(CourseRequest request)  {
        Course course = this.courseRepository.findById(request.getId())
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        String desc = this.parseToList(request.getDescription());
        String require = this.parseToList(request.getRequirement());
        course.setDescription(desc);
        course.setRequirement(require);

        course = this.courseRepository.save(course);
        this.searchService.indexCourse(course.getId());
        return this.courseMapper.toCourseResponse(course);
     
    }
    String parseToList(String raw) {
        try {
            List<String> list = objectMapper.readValue(
                raw, new TypeReference<List<String>>() {}
            );
            return String.join(", ", list);
        } catch (Exception e) {
            throw new ErrorException("Requirement format invalid");
        }
    }

    @Override
    @CheckCourseOwner
    @LogActivity(action = ActivityAction.UPDATE_COURSE, resource = "Course")
    public CourseResponse updateImage(CourseRequest request) {
        Course course = this.courseRepository.findById(request.getId())
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        course.setImagePath(request.getImagePath());
        course = this.courseRepository.save(course);
        this.searchService.indexCourse(course.getId());
        return this.courseMapper.toCourseResponse(course);
    }
    @Override
    @CheckCourseOwner
    @LogActivity(action = ActivityAction.UPDATE_COURSE, resource = "Course")
    public CourseResponse updatePrice(CourseRequest request) {
        Course course = this.courseRepository.findById(request.getId())
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        course.setPrice(request.getPrice());
        course = this.courseRepository.save(course);
        this.searchService.indexCourse(course.getId());
        return this.courseMapper.toCourseResponse(course);
    }
    @Override
    public boolean delete(String id)  {
        Course course = this.courseRepository.findById(id)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        if(!course.getIsActive()) throw new ErrorException("Khoá học đã ngừng hoạt động");
        course.setIsActive(false);
        course.setStatus(CourseStatus.REJECTED);
        this.courseRepository.save(course);
        return true;
    }

  @Override
  public boolean active(String id)  {
    Course course = this.courseRepository.findById(id)
    .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
    if(course.getIsActive()) throw new ErrorException("Khoá học đã được kích hoạt");
    course.setIsActive(true);
    course.setStatus(CourseStatus.PUBLISHED);
    this.courseRepository.save(course);
    this.searchService.indexCourse(id);
    return true;
  }
  @Override
  @CheckCourseOwner
    public boolean deleteByInstructor(String id) {
        Course course = this.courseRepository.findById(id)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
    if(!course.getIsActive()) throw new ErrorException("Khoá học đã ngừng hoạt động");
    if(course.getStatus() == CourseStatus.REJECTED ||
        course.getStatus() == CourseStatus.PENDING) throw new ErrorException("Khoá học chưa được admin phê duyệt"); 
    course.setIsActive(false);
    this.courseRepository.save(course);
    this.searchService.deleteCourse(id);
    return true;
  }
  @Override
  @CheckCourseOwner
  public boolean activeByInstructor(String id) {
    Course course = this.courseRepository.findById(id)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
    if(course.getIsActive()) throw new ErrorException("Khoá học đã được kích hoạt");
    if(course.getStatus() == CourseStatus.REJECTED ||
        course.getStatus() == CourseStatus.PENDING) throw new ErrorException("Khoá học chưa được admin phê duyệt"); 
    course.setIsActive(true);
    this.courseRepository.save(course);
    this.searchService.indexCourse(id);
    return true;
  }
  
    
}
