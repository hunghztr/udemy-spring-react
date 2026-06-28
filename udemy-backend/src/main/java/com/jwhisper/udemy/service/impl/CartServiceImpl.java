package com.jwhisper.udemy.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.cart.CartResponse;
import com.jwhisper.udemy.helper.annotation.CheckCartOwner;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.CartMapper;
import com.jwhisper.udemy.model.Cart;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.projection.coupon.CouponProject;
import com.jwhisper.udemy.repository.CartRepository;
import com.jwhisper.udemy.repository.CouponRepository;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.CartService;

@Service
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CourseRepository courseRepository;
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;
    private final CouponRepository couponRepository;
    public CartServiceImpl(CartRepository cartRepository, CourseRepository courseRepository,
            SecurityHelper securityHelper, UserRepository userRepository, CartMapper cartMapper,
            CouponRepository couponRepository
    ) {
        this.cartRepository = cartRepository;
        this.courseRepository = courseRepository;
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.cartMapper = cartMapper;
        this.couponRepository = couponRepository;
    }
    @Override
    public void add(String courseId) {
        // lấy username từ security context
        String username = this.securityHelper.getCurrentUsername();

        var user = this.userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

        Cart cart = this.cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUser(user);
                    c.setCourses(new ArrayList<>());
                    return this.cartRepository.save(c);
                });

        Course course = this.courseRepository.findById(courseId)
                .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));

        // tránh add trùng
        boolean exists = cart.getCourses()
                .stream()
                .anyMatch(c -> c.getId().equals(courseId));
        boolean moreTen = cart.getCourses().size() >= 10;
        if (exists) {
            throw new ErrorException("Khoá học đã có trong giỏ hàng");
        }
        if (moreTen) {
            throw new ErrorException("Giỏ hàng đã đầy, vui lòng thanh toán trước khi thêm khoá học");
        }

        cart.getCourses().add(course);
        cart.setPrice(cart.getPrice() + course.getPrice());
        cart.setTotal(cart.getTotal() + 1);
        this.cartRepository.save(cart);
    }
    @Override
    // check cart owner bằng aop trước khi vào lấy thông tin giỏ hàng
    @CheckCartOwner
    public CartResponse getCart() {
        String username = this.securityHelper.getCurrentUsername();
        var cart = this.userRepository.findByUsername(username).get().getCart();
        if(cart == null) return null;
        return this.cartMapper.toCartResponse(cart);
    }
    @Override
    @CheckCartOwner
    public void delete(String courseId) {
        String username = this.securityHelper.getCurrentUsername();
        var cart = this.userRepository.findByUsername(username).get().getCart();
        if(cart == null) return;
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        cart.getCourses().removeIf(c -> c.getId().equals(courseId));
        cart.setTotal(cart.getTotal() - 1);
        cart.setPrice(cart.getPrice() - course.getPrice());
        this.cartRepository.save(cart);
    }
    @Override
    public double getSalePrice(String code, String courseId) {
        Course course = this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        List<CouponProject> list = this.couponRepository.findByCourseId(courseId);
        Optional<CouponProject> optional = 
        list.stream().filter(c -> c.getCode().equals(code)).findFirst();
        if(optional.isPresent()){
            return course.getPrice() * (1 - optional.get().getDiscount() / 100.0f);
        }
        throw new ErrorException("Mã giảm giá không hợp lệ");
    }
}
