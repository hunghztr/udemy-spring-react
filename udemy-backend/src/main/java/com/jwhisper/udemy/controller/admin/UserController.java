package com.jwhisper.udemy.controller.admin;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Sort;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.user.UserProject;
import com.jwhisper.udemy.service.UserService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@Slf4j
@RestController
@RequestMapping("/api/v1/admin/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }
    
    @GetMapping()
    @ApiMessage("Lấy danh sách người dùng thành công")
    public ResponseEntity<?> getAll(@PageableDefault(
        page = 0, size = 10,sort = "createdAt",direction = Sort.Direction.ASC
    ) Pageable pageable,@RequestParam("active") boolean isActive,
    @RequestParam(name = "keyword", defaultValue = "") String keyword) throws ErrorException{
        Pagination<UserProject> pagignation = this.userService.getAll(pageable,isActive,keyword);
        return ResponseEntity.ok().body(pagignation);
    }
    
    @PostMapping()
    @ApiMessage("Tạo mới người dùng thành công")
    public ResponseEntity<?> create(@RequestBody User user) throws ErrorException {
        boolean isCreated = this.userService.create(user);
        return ResponseEntity.ok().body(isCreated);
    }
    @GetMapping("/{id}")
    @ApiMessage("Lấy chi tiết người dùng thành công")
    public ResponseEntity<?> get(@PathVariable("id") String id) throws ErrorException {
        UserProject userProject = this.userService.getDetail(id);
        return ResponseEntity.ok().body(userProject);
    }
    @PutMapping("/{id}")
    @ApiMessage("Cập nhật người dùng thành công")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody User entity) throws ErrorException {
        entity.setId(id);
        boolean isUpdated = this.userService.update(entity);
        return ResponseEntity.ok().body(isUpdated);
    }
    @PostMapping("/delete/{id}")
    @ApiMessage("Xoá người dùng thành công")
    public ResponseEntity<?> delete(@PathVariable("id") String id) throws ErrorException {
        boolean isDeleted = this.userService.delete(id);
        return ResponseEntity.ok().body(isDeleted);
    }
    @PostMapping("/active/{id}")
    @ApiMessage("Kích hoạt người dùng thành công")
    public ResponseEntity<?> active(@PathVariable("id") String id) throws ErrorException {
        boolean isActivated = this.userService.active(id);
        return ResponseEntity.ok().body(isActivated);
    }
    
}
