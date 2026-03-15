package com.jwhisper.udemy.controller.instructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.coupon.CouponRequest;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.CouponService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/v1/instructor/coupons")
public class CouponController {
    private final CouponService couponService;
    public CouponController(CouponService couponService){
        this.couponService = couponService;
    }

    @PostMapping("/{courseId}")
    @ApiMessage("Tạo mới mã giảm giá thành công")
    public ResponseEntity<?> create(@PathVariable("courseId") String courseId,
        @RequestBody CouponRequest request) {
        boolean isCreated = this.couponService.isCreated(courseId,request);
        return ResponseEntity.ok(isCreated);
    }
    @GetMapping("/{courseId}")
    @ApiMessage("Lấy danh sách mã giảm giá thành công")
    public ResponseEntity<?> getAll(@PathVariable("courseId") String courseId) {
        return ResponseEntity.ok(this.couponService.getAllByCourseId(courseId));
    }
    
    @PostMapping("/{courseId}/delete/{id}")
    @ApiMessage("Xoá mã giảm giá thành công")
    public ResponseEntity<?> delete(@PathVariable("courseId") String courseId,
    @PathVariable("id") String id) {
        boolean iseDeleted = this.couponService.isDeleted(courseId, id);
        return ResponseEntity.ok(iseDeleted);
    }
    @PutMapping("{courseId}/update/{id}")
    @ApiMessage("Cập nhật mã giảm giá thành công")
    public ResponseEntity<?> update(@PathVariable("courseId") String courseId,
     @RequestBody CouponRequest request) {
        boolean isUpdated = this.couponService.isUpdated(courseId,request);
        return ResponseEntity.ok(isUpdated);
    }
}
