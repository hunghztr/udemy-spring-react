package com.jwhisper.udemy.dto.coupon;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponRequest {
    String id;
    int discount;
    String code;
}
