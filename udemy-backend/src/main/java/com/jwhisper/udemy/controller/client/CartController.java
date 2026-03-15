package com.jwhisper.udemy.controller.client;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.CartService;
import com.jwhisper.udemy.service.OrderService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/v1/carts")
public class CartController {
    private final CartService cartService;
    private final OrderService orderService;
    public CartController(CartService cartService,
        OrderService orderService
    ) {
        this.cartService = cartService;
        this.orderService = orderService;
    }
    @PostMapping("/{courseId}")
    @ApiMessage("Thêm mới khoá học vào giỏ hàng thành công")
    public ResponseEntity<?> add(@PathVariable("courseId") String courseId) {
        this.cartService.add(courseId);
        return ResponseEntity.ok(true);
    }
    @GetMapping()
    @ApiMessage("Lấy thông tin giỏ hàng thành công")
    public ResponseEntity<?> getCart() {
        return ResponseEntity.ok(this.cartService.getCart());
    }
    @DeleteMapping("/{courseId}")
    @ApiMessage("Xoá khoá học khỏi giỏ hàng thành công")
    public ResponseEntity<?> delete(@PathVariable("courseId") String courseId){
        this.cartService.delete(courseId);
        return ResponseEntity.ok(true);
    }
    @GetMapping("/{courseId}/discount/{code}")
    @ApiMessage("Lấy giá tiền sau khi áp mã")
    public ResponseEntity<?> getSalePrice(@PathVariable("courseId") String courseId ,
    @PathVariable("code") String code) {
        double price = this.cartService.getSalePrice(code, courseId);
        return ResponseEntity.ok(price);
    }
    @PostMapping("/check-course-in-order")
    @ApiMessage("Kiểm tra đã mua khoá học này chưa")
    public ResponseEntity<?> check(@RequestBody List<String> coursesId) {
        return ResponseEntity.ok(this.orderService.checkCourse(coursesId));
    }
    
}
