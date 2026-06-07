package com.jwhisper.udemy.dto.user;

import lombok.Data;

@Data
public class BankResponse {
    private String id;
    private String account;
    private String bankName;
    private Double amount;
}
