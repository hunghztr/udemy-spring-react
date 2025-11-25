package com.jwhisper.udemy.service;

public interface MailService {
  void sendMail(String to, String fullname, String subject, String templateName, Object value);
}
