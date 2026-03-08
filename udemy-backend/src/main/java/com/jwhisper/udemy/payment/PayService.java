package com.jwhisper.udemy.payment;

import java.util.List;

import com.jwhisper.udemy.dto.payment.ApplyCode;

import jakarta.servlet.http.HttpServletRequest;

public interface PayService {
    String createPaymentUrl(Double price, HttpServletRequest request) throws Exception;
    void saveOrder(List<ApplyCode> applyCode);
}
