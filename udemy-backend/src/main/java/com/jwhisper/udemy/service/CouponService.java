package com.jwhisper.udemy.service;

import java.util.List;

import com.jwhisper.udemy.dto.coupon.CouponRequest;
import com.jwhisper.udemy.projection.coupon.CouponProject;

public interface CouponService {
    boolean isCreated(CouponRequest couponRequest,String courseId);
    boolean isDeleted(String courseId,String id);
    boolean isUpdated(CouponRequest request,String courseId);
    List<CouponProject> getAllByCourseId(String courseId);
}
