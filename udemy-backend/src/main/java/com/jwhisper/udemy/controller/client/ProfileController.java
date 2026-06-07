package com.jwhisper.udemy.controller.client;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.user.BankRequest;
import com.jwhisper.udemy.dto.user.ProfileRequest;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.UserService;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {
    private final UserService userService;
    public ProfileController(UserService userService){
        this.userService = userService;
    }
    
    @PutMapping("/{id}")
    @ApiMessage("Cập nhật hồ sơ người dùng thành công")
    public ResponseEntity<?> updateProfile(@PathVariable("id") String id,
    @RequestBody ProfileRequest request)  {
        request.setId(id);
        boolean isUpdated = this.userService.updateProfile(request);
        return ResponseEntity.ok(isUpdated);
    }
    
    @GetMapping("/get-pay")
    @ApiMessage("Lấy doanh thu thành công")
    public ResponseEntity<?> getPay(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return ResponseEntity.ok(this.userService.getPay(startDate, endDate));
    }
    @PostMapping("/wallet")
    @ApiMessage("Liên kết tài khoản ngân hàng thành công")
    public ResponseEntity<?> connectWallet(@RequestBody BankRequest bankRequest) {
        this.userService.connectWallet(bankRequest);
        return ResponseEntity.ok(true);
    }
    
}
