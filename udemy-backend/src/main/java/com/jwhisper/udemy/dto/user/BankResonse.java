package com.jwhisper.udemy.dto.user;

import lombok.Data;

@Data
public class BankResonse {
    private String id;
    private String account;
    private String bankName;
    private Double amount;
}
