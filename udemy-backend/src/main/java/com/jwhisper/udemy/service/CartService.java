package com.jwhisper.udemy.service;

import com.jwhisper.udemy.dto.cart.CartResponse;

public interface CartService {
    void add(String courseId);
    CartResponse getCart();
    void delete(String courseId);
    double getSalePrice(String code,String courseId);
}
