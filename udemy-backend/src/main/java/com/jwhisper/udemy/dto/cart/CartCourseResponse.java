package com.jwhisper.udemy.dto.cart;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class CartCourseResponse {
    String id;
    String name;
    String imagePath;
    double price;
    double star;
    double hour;
}
