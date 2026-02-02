package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.coupon.CouponRequest;
import com.jwhisper.udemy.dto.coupon.CouponResponse;
import com.jwhisper.udemy.model.Coupon;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CouponMapper {
    Coupon toCoupon(CouponRequest request);
    CouponResponse toCouponResponse(Coupon coupon);
}

