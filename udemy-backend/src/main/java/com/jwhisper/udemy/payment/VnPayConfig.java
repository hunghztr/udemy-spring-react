package com.jwhisper.udemy.payment;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Configuration
@ConfigurationProperties(prefix = "vnpay")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnPayConfig {
    String tmnCode;
    String hashSecret;
    String payUrl;
    String returnUrl;
}
