package com.jwhisper.udemy.service;

import java.util.List;

import com.jwhisper.udemy.dto.coupon.CouponRequest;
import com.jwhisper.udemy.projection.coupon.CouponProject;

public interface CouponService {
    boolean isCreated(String courseId, CouponRequest couponRequest);
    boolean isDeleted(String courseId,String id);
    boolean isUpdated(String courseId,CouponRequest request);
    List<CouponProject> getAllByCourseId(String courseId);
}
