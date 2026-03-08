package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.cart.CartCourseResponse;
import com.jwhisper.udemy.dto.cart.CartResponse;
import com.jwhisper.udemy.model.Cart;
import com.jwhisper.udemy.model.Course;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CartMapper {
    CartResponse toCartResponse(Cart cart);
    CartCourseResponse toCartCourseResponse(Course course);
}
