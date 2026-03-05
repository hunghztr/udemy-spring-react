package com.jwhisper.udemy.controller.client;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.user.ProfileRequest;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {
    private final UserService userService;
    public ProfileController(UserService userService){
        this.userService = userService;
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật hồ sơ người dùng thành công")
    public ResponseEntity<?> updateProfile(@PathVariable("id") String id,
    @RequestBody ProfileRequest request)  {
        request.setId(id);
        boolean isUpdated = this.userService.updateProfile(request);
        return ResponseEntity.ok(isUpdated);
    }
    @GetMapping("/{id}")
    @ApiMessage("Lấy thông tin hồ sơ người dùng thành công")
    public ResponseEntity<?> getProfile(@PathVariable("id") String id) {
        return ResponseEntity.ok().body(this.userService.getProfile(id));
    }
    
}
