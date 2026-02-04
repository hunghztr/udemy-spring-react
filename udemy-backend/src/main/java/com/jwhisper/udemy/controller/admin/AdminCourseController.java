package com.jwhisper.udemy.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.projection.course.CourseProject;
import com.jwhisper.udemy.service.CourseService;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/api/v1/admin/courses")
public class AdminCourseController {
    private final CourseService courseService;
    public AdminCourseController(CourseService courseService
    ){
        this.courseService = courseService;
    }
    @GetMapping()
    @ApiMessage("Lấy danh sách khoá học thành công")
    public ResponseEntity<?> getAll(@PageableDefault(
        page = 0, size = 10,sort = "createdAt",direction = Sort.Direction.ASC
    ) Pageable pageable,@RequestParam("active") boolean isActive,
    @RequestParam(name = "keyword", defaultValue = "") String keyword) {
        Pagination<CourseProject> pagination = this.courseService.getAll(pageable,isActive,keyword);
        return ResponseEntity.ok(pagination);
    }
    
    @PostMapping("/delete/{id}")
    @ApiMessage("Xoá mềm khoá học thành công")
    public ResponseEntity<?> delete(@PathVariable("id") String id)  {
        boolean isDeleted = this.courseService.delete(id);
        return ResponseEntity.ok().body(isDeleted);
    }
    @PostMapping("/active/{id}")
    @ApiMessage("Kích hoạt khoá học thành công")
    public ResponseEntity<?> active(@PathVariable("id") String id)  {
        boolean isActivated = this.courseService.active(id);
        return ResponseEntity.ok().body(isActivated);
    }
    
    
}
