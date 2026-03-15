package com.jwhisper.udemy.dto.user;

import lombok.Data;

@Data
public class WalletResponse {
    private String id;
    private String username;
    private String fullname;
    private String account;
    private String bankName;
    private Double amount;
    
}
