package com.jwhisper.udemy.controller.admin;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.user.UserRequest;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.annotation.CheckPermission;
import com.jwhisper.udemy.projection.user.UserProject;
import com.jwhisper.udemy.service.OrderService;
import com.jwhisper.udemy.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/users")
public class UserController {

    private final UserService userService;
    private final OrderService orderService;

    public UserController(UserService userService, OrderService orderService){
        this.userService = userService;
        this.orderService = orderService;
    }

    @GetMapping()
    @CheckPermission("get list user")
    @ApiMessage("Lấy danh sách người dùng thành công")
    public ResponseEntity<?> getAll(
            @PageableDefault(
                    page = 0,
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.ASC
            ) Pageable pageable,
            @RequestParam("active") boolean isActive,
            @RequestParam(name = "keyword", defaultValue = "") String keyword) {

        Pagination<UserProject> pagination =
                this.userService.getAll(pageable, isActive, keyword);

        return ResponseEntity.ok().body(pagination);
    }

    @PostMapping()
    @CheckPermission("create user")
    @ApiMessage("Tạo mới người dùng thành công")
    public ResponseEntity<?> create(@RequestBody UserRequest user) {
        boolean isCreated = this.userService.create(user);
        return ResponseEntity.ok().body(isCreated);
    }

    @GetMapping("/{id}")
    @CheckPermission("get user")
    @ApiMessage("Lấy chi tiết người dùng thành công")
    public ResponseEntity<?> get(@PathVariable("id") String id) {
        UserProject userProject = this.userService.get(id);
        return ResponseEntity.ok().body(userProject);
    }

    @PutMapping("/{id}")
    @CheckPermission("update user")
    @ApiMessage("Cập nhật người dùng thành công")
    public ResponseEntity<?> update(
            @PathVariable("id") String id,
            @RequestBody UserRequest request) {

        request.setId(id);
        boolean isUpdated = this.userService.update(request);

        return ResponseEntity.ok().body(isUpdated);
    }

    @PostMapping("/delete/{id}")
    @CheckPermission("delete soft user")
    @ApiMessage("Xoá mềm người dùng thành công")
    public ResponseEntity<?> delete(@PathVariable("id") String id) {

        boolean isDeleted = this.userService.delete(id);

        return ResponseEntity.ok().body(isDeleted);
    }

    @PostMapping("/active/{id}")
    @CheckPermission("activate user")
    @ApiMessage("Kích hoạt người dùng thành công")
    public ResponseEntity<?> active(@PathVariable("id") String id) {

        boolean isActivated = this.userService.active(id);

        return ResponseEntity.ok().body(isActivated);
    }

    @GetMapping("/get-by-course/{courseId}")
    @CheckPermission("get user by course")
    @ApiMessage("Lấy người dùng theo khoá học")
    public ResponseEntity<?> getUser(@PathVariable("courseId") String courseId) {

        UserProject userProject =
                this.userService.getByCourseId(courseId);

        return ResponseEntity.ok(userProject);
    }

    @GetMapping("/get-bought-courses/{username}")
    @CheckPermission("get bought course")
    @ApiMessage("Lấy khoá học người dùng đã mua")
    public ResponseEntity<?> getCourses(@PathVariable("username") String username) {

        return ResponseEntity.ok(
                this.orderService.getBoughtCourses(username)
        );
    }

}