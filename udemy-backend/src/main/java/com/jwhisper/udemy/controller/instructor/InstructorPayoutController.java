package com.jwhisper.udemy.controller.instructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.user.InstructorRevenueResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.InstructorPayoutService;
import com.jwhisper.udemy.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/instructors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InstructorPayoutController {

    InstructorPayoutService instructorPayoutService;
    SecurityHelper securityHelper;
    UserService userService;

    // Giảng viên xem doanh thu của chính mình
    @GetMapping("/revenue")
    @ApiMessage("Lấy doanh thu của giảng viên hiện tại thành công")
    // @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<InstructorRevenueResponse> getMyRevenue(
    ) {
        String username = this.securityHelper.getCurrentUsername();
        User user = this.userService.findOriginByUsername(username);
        return ResponseEntity.ok(instructorPayoutService.getInstructorRevenue(user.getId()));
    }

    // Admin xem doanh thu của bất kỳ giảng viên nào
    @GetMapping("/revenue/{instructorId}")
    @ApiMessage("Lấy doanh thu của giảng viên thành công")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InstructorRevenueResponse> getInstructorRevenue(
        @PathVariable("instructorId") String instructorId
    ) {
        return ResponseEntity.ok(instructorPayoutService.getInstructorRevenue(instructorId));
    }
}