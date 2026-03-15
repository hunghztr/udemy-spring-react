package com.jwhisper.udemy.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.rating.RatingResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.annotation.CheckPermission;
import com.jwhisper.udemy.service.LearningService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/v1/admin/learnings")
public class AdminLearningController {
    private final LearningService learningService;

    public AdminLearningController(LearningService learningService) {
        this.learningService = learningService;
    }
    @DeleteMapping("/{userId}/{courseId}")
    @ApiMessage("Xoá đánh giá không hợp lệ thành công")
    @CheckPermission("remove rating")
    public ResponseEntity<?> delete(@PathVariable("userId") String userId,
    @PathVariable("courseId") String courseId){
        this.learningService.delete(userId, courseId);
        return ResponseEntity.ok(null);
    }
    @GetMapping("/get-rating-by-user/{userId}/{courseId}")
    @ApiMessage("Lấy đánh giá theo người dùng")
    @CheckPermission("get ratings by user")
    public ResponseEntity<?> getRating(@PathVariable("userId") String userId,
    @PathVariable("courseId") String courseId) {
        RatingResponse response = this.learningService.getByUserAndCourse(userId,courseId);
        return ResponseEntity.ok(response);
    }
    
}
