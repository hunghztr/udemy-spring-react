package com.jwhisper.udemy.controller.client;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.SliceResponse;
import com.jwhisper.udemy.dto.learning.FinishRequest;
import com.jwhisper.udemy.dto.rating.RatingRequest;
import com.jwhisper.udemy.dto.rating.RatingResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.LearningService;
import com.jwhisper.udemy.service.LectureService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/api/v1/learnings")
public class LearningController {

    private final LearningService learningService;
    private final LectureService lectureService;
    public LearningController(LearningService learningService, LectureService lectureService){
        this.learningService = learningService;
        this.lectureService = lectureService;
    }
    @GetMapping()
    @ApiMessage("Lấy danh sách học tập thành công")
    public ResponseEntity<?> getAll(@RequestParam(name= "status",required = false) String status) {
        return ResponseEntity.ok(this.learningService.getAll(status));
    }
    @GetMapping("/learn/{courseId}")
    @ApiMessage("Mở khoá học thành công")
    public ResponseEntity<?> open(@PathVariable("courseId") String courseId) {
        return ResponseEntity.ok(this.learningService.learning(courseId));
    }
    @PutMapping("/lecture/{id}")
    @ApiMessage("Đánh dấu hoàn thành bài học")
    public ResponseEntity<?> mark(@PathVariable("id") String id,@RequestBody FinishRequest request) {
        var lecture = this.lectureService.markFinish(id,request.getFinish());
        return ResponseEntity.ok(lecture);
    }
    @GetMapping("/get-ratings/{courseId}")
    @ApiMessage("Lấy danh sách đánh giá thành công")
    public ResponseEntity<?> getAllRatings(@PathVariable("courseId") String courseId,
    @PageableDefault(
        page = 0, size = 10,sort = "createdAt",direction = Sort.Direction.DESC
    ) Pageable pageable
    ) {
        SliceResponse<RatingResponse> ratings = this.learningService.getRatings(courseId,pageable);
        return ResponseEntity.ok(ratings);
    }
    @PostMapping("/rate/{courseId}")
    @ApiMessage("Đánh giá khoá học thành công")
    public ResponseEntity<?> rate(@PathVariable("courseId") String courseId,
        @RequestBody @Valid RatingRequest request) {
        var response = this.learningService.createRating(request,courseId);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/ratings/get-count/{courseId}")
    @ApiMessage("Lấy tổng số lượng đánh giá thành công")
    public ResponseEntity<?> getCount(@PathVariable("courseId") String courseId) {
        return ResponseEntity.ok(this.learningService.countRatings(courseId));
    }
}
