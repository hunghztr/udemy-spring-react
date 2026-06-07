package com.jwhisper.udemy.controller.admin;

import java.time.LocalDate;

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
import com.jwhisper.udemy.dto.course.CourseResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
// import com.jwhisper.udemy.helper.annotation.CheckPermission;
import com.jwhisper.udemy.service.CategoryService;
import com.jwhisper.udemy.service.CourseService;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
public class DashBoardController {
    private final CourseService courseService;
    private final CategoryService categoryService;
    public DashBoardController(CourseService courseService,
        CategoryService categoryService
    ) {
        this.courseService = courseService;
        this.categoryService = categoryService;
    }
    @GetMapping()
    @ApiMessage("Lấy danh sách thống kê thành công")
    // @CheckPermission("get list dashboard")
    public ResponseEntity<?> getAllDashBoard(
            @PageableDefault(
                    page = 0,
                    size = 10,
                    sort = "sold",
                    direction = Sort.Direction.DESC
            ) Pageable pageable,

            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {

        Pagination<CourseResponse> pagination =
                this.courseService.getDashBoard(pageable,startDate,endDate);

        return ResponseEntity.ok(pagination);
    }
    @GetMapping("/get-categories")
    @ApiMessage("Lấy danh sách danh mục thành công")
    // @CheckPermission("Get list categories of dash")
    public ResponseEntity<?> getCategoriesDash(){
        var list = this.categoryService.getByDashBoard();
        return ResponseEntity.ok(list);
    }
    @GetMapping("get-student-by-months/{categoryId}")
    @ApiMessage("Lấy học viên theo tháng thành công")
    // @CheckPermission("Get list student by months")
    public ResponseEntity<?> getStudentsByMonths(@PathVariable("categoryId") String id){
        var list = this.categoryService.getByMonths(id);
        return ResponseEntity.ok(list);
    }
}
