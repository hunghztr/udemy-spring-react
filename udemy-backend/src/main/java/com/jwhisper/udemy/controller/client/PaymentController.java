package com.jwhisper.udemy.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.StringResult;
import com.jwhisper.udemy.dto.payment.ApplyCode;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.payment.PayService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/v1/payments")
public class PaymentController {
    private final PayService payService;
    public PaymentController(PayService payService){
        this.payService = payService;
    }
    @PostMapping("/vnpay")
    @ApiMessage("Tạo mới thanh toán vnpay")
    public ResponseEntity<?> createPayment(@RequestParam(name = "price") Double price,
        HttpServletRequest request) throws Exception {
        StringResult result = new StringResult();
        result.setResult(this.payService.createPaymentUrl(
                price,
                request
        ));
        return ResponseEntity.ok(result);
    }
    @PostMapping()
    @ApiMessage("Lưu thông tin order")
    public ResponseEntity<?> saveOrder(@RequestBody List<ApplyCode> applyCode) {
        this.payService.saveOrder(applyCode);
        return ResponseEntity.ok(true);
    }
    
}
