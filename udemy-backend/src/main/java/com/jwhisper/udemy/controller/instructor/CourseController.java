package com.jwhisper.udemy.controller.instructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseDetailResponse;
import com.jwhisper.udemy.dto.course.CourseRequest;
import com.jwhisper.udemy.dto.course.CourseResponse;
import com.jwhisper.udemy.dto.course.LectureRequest;
import com.jwhisper.udemy.dto.course.SectionRequest;
import com.jwhisper.udemy.dto.course.SectionResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.service.CourseService;
import com.jwhisper.udemy.service.LectureService;
import com.jwhisper.udemy.service.SectionService;
import com.turkraft.springfilter.boot.Filter;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/v1/instructor/courses")
public class CourseController {
    private final CourseService courseService;
    private final SectionService sectionService;
    private final LectureService lectureService;
    public CourseController(CourseService courseService,
        SectionService sectionService,
        LectureService lectureService
    ){
        this.courseService = courseService;
        this.sectionService = sectionService;
        this.lectureService = lectureService;
    }
    @PostMapping()
    @ApiMessage("Tạo mới khoá học thành công")
    public ResponseEntity<?> create(@RequestBody CourseRequest request)  {
        this.courseService.create(request);
        return ResponseEntity.ok().body(true);
    }

    @GetMapping("/get-courses-by-author")
    @ApiMessage("Lấy danh sách khoá học của giảng viên thành công")
    public ResponseEntity<?> getByAuthor(@Filter Specification<Course> spec,
       @PageableDefault(page = 0,size = 10,sort = "createdAt") Pageable pageable
    )  {
        Pagination<CourseResponse> pagination = this.courseService.getAllByAuthor(spec, pageable);
        return ResponseEntity.ok(pagination);
    }
    
    @GetMapping("/{id}")
    @ApiMessage("Lấy chi tiết khoá học thành công")
    public ResponseEntity<?> get(@PathVariable("id") String id)  {
        CourseDetailResponse detailResponse = this.courseService.getDetail(id);
        return ResponseEntity.ok(detailResponse);
    }
    
    @PutMapping("/description/{id}")
    @ApiMessage("Cập nhật thông tin khoá học thành công")
    public ResponseEntity<?> putDescription(@PathVariable("id") String id, @RequestBody CourseRequest entity)  {
        this.courseService.updateDesc(id,entity);
        return ResponseEntity.ok(true);
    }
    @PostMapping("/section/{courseId}")
    @ApiMessage("Thêm mới chương học thành công")
    public ResponseEntity<?> createSection(@PathVariable("courseId") String courseId,
    @RequestBody SectionRequest request) {
        SectionResponse sectionResponse = this.sectionService.create( courseId,request);
        return ResponseEntity.ok(sectionResponse);
    }
    @PutMapping("/{courseId}/section/{id}")
    @ApiMessage("Cập nhật tên chương học thành công")
    public ResponseEntity<?> updateSection(@PathVariable("id") String id,@PathVariable("courseId") String courseId,
    @RequestBody SectionRequest request) {
        request.setId(id);
        SectionResponse sectionResponse = this.sectionService.updateName(courseId,request);
        return ResponseEntity.ok(sectionResponse);
    }
    // gen quizz
    @PutMapping("/{courseId}/lecture/{id}")
    @ApiMessage("Cập nhật tên bài học thành công")
    public ResponseEntity<?> updateLectureName(@PathVariable String id, @PathVariable("courseId") String courseId,
    @RequestBody LectureRequest request) {
        request.setId(id);
        SectionResponse sectionResponse = this.lectureService.updateName(courseId,request);
        return ResponseEntity.ok(sectionResponse);
    }
    @DeleteMapping("/{courseId}/delete/section/{id}")
    @ApiMessage("Xoá chương học thành công")
    public ResponseEntity<?> deleteSection(@PathVariable("courseId") String courseId,
    @PathVariable("id") String id) {
        boolean isDeleted = this.sectionService.isDeleted(id, courseId);
        return ResponseEntity.ok(isDeleted);
    }
    // gen quizz
    @DeleteMapping("/{courseId}/delete/lecture/{id}")
    @ApiMessage("Xoá bài học thành công")
    public ResponseEntity<?> deleteLecture(@PathVariable("courseId") String courseId,
    @PathVariable("id") String id) {
        SectionResponse sectionResponse = this.lectureService.delete(courseId,id);
        return ResponseEntity.ok(sectionResponse);
    }
    // gen quizz
    @PostMapping("/lecture/{id}")
    @ApiMessage("Thêm mới bài học thành công")
    public ResponseEntity<?> createLecture(@PathVariable("id") String courseId,
    @RequestBody LectureRequest request) {
        SectionResponse sectionResponse = this.lectureService.create(courseId,request);
        return ResponseEntity.ok(sectionResponse);
    }
    @PutMapping("/{courseId}/lecture-video/{id}")
    @ApiMessage("Cập nhật bài học thành công")
    public ResponseEntity<?> updateLectureVideo(@PathVariable("courseId") String courseId,
    @PathVariable("id") String id,
     @RequestBody LectureRequest request) {
        request.setId(id);
        var section = this.lectureService.updatedVideo( courseId,request);
        return ResponseEntity.ok(section);
    }
    @PostMapping("/{sectionId}/reorder-lectures")
    @ApiMessage("Cập nhật các bài học thành công")
    public ResponseEntity<?> reOrder(@PathVariable("sectionId") String secitonId,
    @RequestBody List<String> requests) {
        SectionResponse sectionResponse = this.lectureService.reorder(requests, secitonId);
        return ResponseEntity.ok(sectionResponse);
    }
    @PutMapping("/update-image/{id}")
    @ApiMessage("Cập nhật hình ảnh khoá học thành công")
    public ResponseEntity<?> updateImage(@PathVariable("id") String id, @RequestBody CourseRequest request) {
        this.courseService.updateImage(id,request);
        return ResponseEntity.ok(true);
    }
    @PutMapping("/update-price/{id}")
    @ApiMessage("Cập nhật giá tiền")
    public ResponseEntity<?> updatePrice(@PathVariable("id") String id, @RequestBody CourseRequest request) {
        this.courseService.updatePrice(id,request);
        return ResponseEntity.ok(true);
    }
    @PostMapping("/delete/{id}")
    @ApiMessage("Xoá mềm khoá học thành công")
    public ResponseEntity<?> delete(@PathVariable("id") String id) {
        boolean isDeleted = this.courseService.deleteByInstructor(id);
        return ResponseEntity.ok(isDeleted);
    }
    @PostMapping("/active/{id}")
    @ApiMessage("Kích hoạt khoá học thành công")
    public ResponseEntity<?> activate(@PathVariable("id") String id) {
        boolean isDeleted = this.courseService.activeByInstructor(id);
        return ResponseEntity.ok(isDeleted);
    }
    
    
}
