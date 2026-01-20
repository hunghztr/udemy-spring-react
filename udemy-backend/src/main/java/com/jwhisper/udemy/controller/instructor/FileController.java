package com.jwhisper.udemy.controller.instructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jwhisper.udemy.dto.StringResult;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.CloudService;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/v1/files")
public class FileController {
    private final CloudService cloudService;
    public FileController(CloudService cloudService){
        this.cloudService = cloudService;
    }

    @PostMapping("/avatars/{id}")
    @ApiMessage("Tải file avatar lên thành công")
    public ResponseEntity<?> uploadAvatar(@PathVariable("id") String id, 
    MultipartFile file) throws IOException {
        String avatarPath = this.cloudService.uploadAvatar(file, id);
        StringResult result = new StringResult();
        result.setResult(avatarPath);
        return ResponseEntity.ok(result);
    }
    
}
