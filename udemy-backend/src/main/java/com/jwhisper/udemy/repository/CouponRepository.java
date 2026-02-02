package com.jwhisper.udemy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Coupon;
import com.jwhisper.udemy.projection.coupon.CouponProject;

@Repository
public interface CouponRepository extends JpaRepository<Coupon,String> {
    boolean existsByCodeAndCourseId(String code,String courseId);
    List<CouponProject> findAllProjectByCourseId(String courseId);
}
