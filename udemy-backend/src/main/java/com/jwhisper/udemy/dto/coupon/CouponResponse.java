package com.jwhisper.udemy.dto.coupon;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponResponse {
    String id;
    int discount;
    String code;
}
