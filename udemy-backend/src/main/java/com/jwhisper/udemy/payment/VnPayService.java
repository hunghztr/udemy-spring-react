package com.jwhisper.udemy.payment;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.payment.ApplyCode;
import com.jwhisper.udemy.helper.annotation.CheckCartOwner;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.Cart;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.model.InstructorPayout;
import com.jwhisper.udemy.model.Learning;
import com.jwhisper.udemy.model.Order;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.model.UserCourseKey;
import com.jwhisper.udemy.projection.coupon.CouponProject;
import com.jwhisper.udemy.repository.CartRepository;
import com.jwhisper.udemy.repository.CouponRepository;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.InstructorPayoutRepository;
import com.jwhisper.udemy.repository.LearningRepository;
import com.jwhisper.udemy.repository.OrderRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VnPayService implements PayService {
    private final VnPayConfig vnPayConfig;
    private final SecurityHelper securityHelper;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final InstructorPayoutRepository instructorPayoutRepository;
    private final CourseRepository courseRepository;
    private final LearningRepository learningRepository;
    private final CartRepository cartRepository;
    public VnPayService(VnPayConfig vnPayConfig,
        SecurityHelper securityHelper,UserRepository userRepository,
        OrderRepository orderRepository, InstructorPayoutRepository instructorPayoutRepository,
        CouponRepository couponRepository, CourseRepository courseRepository,
        LearningRepository learningRepository,CartRepository cartRepository
    ){
        this.vnPayConfig = vnPayConfig;
        this.securityHelper = securityHelper;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.instructorPayoutRepository = instructorPayoutRepository;
        this.couponRepository = couponRepository;
        this.courseRepository = courseRepository;
        this.learningRepository = learningRepository;
        this.cartRepository = cartRepository;
    }
    public String createPaymentUrl(Double price, HttpServletRequest request) throws Exception {

        Map<String, String> params = new HashMap<>();

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        long amount = (long) (price * 100);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", System.currentTimeMillis()+"");
        params.put("vnp_OrderInfo", "Thanh toan khoa hoc");
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        params.put("vnp_IpAddr", request.getRemoteAddr());

        String createDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        params.put("vnp_CreateDate", createDate);

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String field : fieldNames) {

            String value = URLEncoder.encode(params.get(field), StandardCharsets.UTF_8);

            hashData.append(field).append("=").append(value).append("&");
            query.append(field).append("=").append(value).append("&");
        }

        hashData.deleteCharAt(hashData.length() - 1);
        query.deleteCharAt(query.length() - 1);

        String secureHash =
                VnPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());

        query.append("&vnp_SecureHash=").append(secureHash);

        return vnPayConfig.getPayUrl() + "?" + query;
    }
    @Override
    @CheckCartOwner
    @Transactional
    public void saveOrder(List<ApplyCode> applyCode) {

        String username = securityHelper.getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

        Cart cart = user.getCart(); // aop đã check cart

        List<Course> courses = new ArrayList<>(cart.getCourses());

        // tạo order
        Order order = new Order();
        order.setPrice(cart.getPrice());
        order.setTotal(cart.getTotal());
        order.setCustomer(user);
        order.setCourses(courses);

        orderRepository.save(order);

        // xóa cart
        this.cartRepository.delete(cart);
        user.setCart(null);

        // tạo payout
        makeMonkeyForIns(courses, applyCode);

        // tăng sold (atomic query)
        courses.forEach(c ->
                courseRepository.increaseSold(c.getId())
        );
        courses.forEach(c -> this.generateLearning(user, c));
    }
    private void makeMonkeyForIns(List<Course> courses, List<ApplyCode> applyCodes) {

        List<InstructorPayout> payouts = new ArrayList<>();

        for (Course course : courses) {

            User author = course.getAuthor();
            double finalPrice = course.getPrice();

            ApplyCode applyCode = applyCodes.stream()
                    .filter(a -> a.getCourseId().equals(course.getId()))
                    .findFirst()
                    .orElse(null);

            if (applyCode != null) {

                CouponProject coupon = couponRepository
                        .findByCourseId(course.getId())
                        .stream()
                        .filter(c -> c.getCode().equals(applyCode.getCode()))
                        .findFirst()
                        .orElse(null);

                if (coupon != null) {
                    finalPrice = course.getPrice() *
                            (1 - coupon.getDiscount() / 100.0);
                }
            }

            // instructor nhận 80%
            finalPrice = finalPrice * 0.8;

            InstructorPayout payout = new InstructorPayout();
            payout.setInstructor(author);
            payout.setCourse(course);
            payout.setAmount(finalPrice);

            payouts.add(payout);
        }

        instructorPayoutRepository.saveAll(payouts);
    }
    private void generateLearning(User user, Course course) {
        boolean exists = learningRepository
            .existsByCustomerIdAndCourseId(user.getId(), course.getId());

        if (exists) return;
        Learning learning = new Learning();

        UserCourseKey key = new UserCourseKey();
        key.setUserId(user.getId());
        key.setCourseId(course.getId());

        learning.setId(key);
        learning.setCustomer(user);
        learning.setCourse(course);
        learning.setProgress(0);

        learningRepository.save(learning);
    }
}
