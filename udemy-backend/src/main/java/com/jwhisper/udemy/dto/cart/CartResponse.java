package com.jwhisper.udemy.dto.cart;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class CartResponse {
    String id;
    double price;
    int total;
    CartCourseResponse[] courses;
}
