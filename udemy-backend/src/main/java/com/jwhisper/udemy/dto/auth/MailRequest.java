package com.jwhisper.udemy.dto.auth;

import lombok.Data;

@Data
public class MailRequest {
  private String resetToken;
  private String value;
  private String email;

}
