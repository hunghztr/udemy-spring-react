package com.jwhisper.udemy.controller.client;

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
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.HomeService;


@RestController
@RequestMapping("/api/v1/client")
public class HomeController {
    private final HomeService homeService;
    public HomeController(HomeService homeService){
        this.homeService = homeService;
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
    
}
