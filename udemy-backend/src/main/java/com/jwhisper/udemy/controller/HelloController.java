package com.jwhisper.udemy.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.service.CloudService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@Slf4j
@RequestMapping("/api/v1")
class HelloController {

  private final CloudService cloudService;
  public HelloController(CloudService cloudService){
    this.cloudService = cloudService;
  }
  @GetMapping("/hello")
  @ApiMessage("gọi api thành công")
  public String hello() throws ErrorException {

    return "Hello, World!, ";
  }

  @GetMapping("/hello-admin")
  public String helloAdmin() {
    return "Hello, Admin!";
  }

  @GetMapping("/hello-user")
  public String helloUser() {
    return "Hello, User!";
  }

  @PostMapping("/{id}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable("id") String id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        String avatarUrl = this.cloudService.uploadAvatar(file, id);
        return ResponseEntity.ok(Map.of(
                "message", "Upload avatar success",
                "avatarUrl", avatarUrl
        ));
    }
}