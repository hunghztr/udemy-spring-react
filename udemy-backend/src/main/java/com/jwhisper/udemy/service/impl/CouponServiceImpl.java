package com.jwhisper.udemy.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.coupon.CouponRequest;
import com.jwhisper.udemy.helper.annotation.CheckCourseOwner;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CouponMapper;
import com.jwhisper.udemy.model.Coupon;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.projection.coupon.CouponProject;
import com.jwhisper.udemy.repository.CouponRepository;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.service.CouponService;

@Service
public class CouponServiceImpl implements CouponService {
    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;
    private final CourseRepository courseRepository;
    public CouponServiceImpl(CouponRepository couponRepository,
      CouponMapper couponMapper,CourseRepository courseRepository
    ){
        this.couponRepository = couponRepository;
        this.couponMapper = couponMapper;
        this.courseRepository = courseRepository;
    }
    // aop check khoá học có thuộc về user hay không, nếu không sẽ trả về lỗi
    @Override
    @CheckCourseOwner
    public boolean isCreated(CouponRequest request,String courseId) {
        if(this.couponRepository.existsByCodeAndCourseId(request.getCode(),courseId)) 
            throw new ErrorException("Code này đã tồn tại");
        if(this.couponRepository.count() == 10)
            throw new ErrorException("Mã giảm giá đã đủ, không thể tạo thêm");
        Course course = this.courseRepository.findById(courseId).orElseThrow(
            () -> new ErrorException("Khoá học không tồn tại")
        );
        Coupon coupon = this.couponMapper.toCoupon(request);
        coupon.setCourse(course);
        this.couponRepository.save(coupon);
        return true;
    }
    @Override
    @CheckCourseOwner
    public List<CouponProject> getAllByCourseId(String courseId) {
        List<CouponProject> couponProjects = this.couponRepository.findAllProjectByCourseId(courseId);
        return couponProjects;
    }
    @Override
    @CheckCourseOwner
    public boolean isDeleted(String courseId, String id) {
        this.couponRepository.deleteById(id);
        return true;
    }
    @Override
    @CheckCourseOwner
    public boolean isUpdated(CouponRequest request, String courseId) {
        Coupon coupon = this.couponRepository.findById(request.getId())
        .orElseThrow(() -> new ErrorException("Mã giảm giá không tồn tại"));
        coupon.setCode(request.getCode());
        coupon.setDiscount(request.getDiscount());
        this.couponRepository.save(coupon);
        return true;
    }
}
