package com.jwhisper.udemy.controller.client;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.SliceResponse;
import com.jwhisper.udemy.dto.category.CategoryCourseResponse;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.dto.course.FilterRequest;
import com.jwhisper.udemy.dto.rating.RatingResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.HomeService;
import com.jwhisper.udemy.service.LearningService;
import com.jwhisper.udemy.service.UserService;


@RestController
@RequestMapping("/api/v1/client")
public class HomeController {
    private final HomeService homeService;
    private final UserService userService;
    private final LearningService learningService;
    public HomeController(HomeService homeService, UserService userService,
        LearningService learningService
    ){
        this.homeService = homeService;
        this.userService = userService;
        this.learningService = learningService;
    }
    
    @GetMapping("/categories/get-all-parents")
    @ApiMessage("Lấy danh sách danh mục cha thành công")
    public ResponseEntity<?> getAllParents(@PageableDefault(page = 0,size = 10,
        sort = "createdAt",direction = Sort.Direction.ASC) Pageable pageable,
        @RequestParam(name = "active",required = false) boolean isActive,
    @RequestParam(name = "keyword",required = false) String keyword)  {

        Pagination<CategoryParentResponse> parents =
         this.homeService.getAllParents(pageable,isActive);
        return ResponseEntity.ok().body(parents);
    }
    @GetMapping("/categories/get-all-children")
    @ApiMessage("Lấy danh sách danh mục con thành công")
    public ResponseEntity<?> getAllChildren() {
        List<CategoryCourseResponse> projections = this.homeService.getAllChildren();
        return ResponseEntity.ok(projections);
    }
    
    @GetMapping("/get-course-detail/{id}")
    @ApiMessage("Lấy chi tiết khoá học thành công")
     public ResponseEntity<?> getCourseDetail(@PathVariable("id") String id)  {
        return ResponseEntity.ok().body(this.homeService.getCourseDetail(id));
    }
    @GetMapping("/get-interested-courses")
    @ApiMessage("Lấy khoá học nổi bật dành cho bạn thành công")
    public ResponseEntity<?> getInterestedCourse() {
        return ResponseEntity.ok(this.homeService.getInterestedCourses());
    }
    @GetMapping("/get-courses-by-category/{id}")
    @ApiMessage("Lấy danh sách khoá học theo danh mục thành công")
    public ResponseEntity<?> getCoursesByCategory(@PathVariable("id") String id,
        @PageableDefault(page = 0, size = 10) Pageable pageable,
    FilterRequest filterRequest) {
        return ResponseEntity.ok(this.homeService.getCoursesByCategory(id,pageable,filterRequest));
    }
    @GetMapping("/get-recommend")
    @ApiMessage("Lấy khoá học gợi ý thành công")
    public ResponseEntity<?> getRecommend() {
        return ResponseEntity.ok(this.homeService.getRecommend());
    }
    @GetMapping("/profiles/{id}")
    @ApiMessage("Lấy thông tin hồ sơ người dùng thành công")
    public ResponseEntity<?> getProfile(@PathVariable("id") String id) {
        return ResponseEntity.ok().body(this.userService.getProfile(id));
    }
    @GetMapping("/get-ratings/{courseId}")
    @ApiMessage("Lấy danh sách đánh giá thành công")
    public ResponseEntity<?> getAllRatings(@PathVariable("courseId") String courseId,
    @PageableDefault(
        page = 0, size = 10,sort = "createdAt",direction = Sort.Direction.DESC
    ) Pageable pageable
    ) {
        SliceResponse<RatingResponse> ratings = this.learningService.getRatings(courseId,pageable);
        return ResponseEntity.ok(ratings);
    }
    @GetMapping("/ratings/get-count/{courseId}")
    @ApiMessage("Lấy tổng số lượng đánh giá thành công")
    public ResponseEntity<?> getCount(@PathVariable("courseId") String courseId) {
        return ResponseEntity.ok(this.learningService.countRatings(courseId));
    }
}
