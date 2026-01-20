package com.jwhisper.udemy.controller.instructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.user.ProfileRequest;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
    @RequestBody ProfileRequest request) throws ErrorException {
        request.setId(id);
        boolean isUpdated = this.userService.updateProfile(request);
        return ResponseEntity.ok(isUpdated);
    }
    
}
