package com.jwhisper.udemy.service.impl;

import java.nio.charset.StandardCharsets;

import org.springframework.mail.MailException;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.jwhisper.udemy.service.MailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailServiceImpl implements MailService {

  private final JavaMailSender javaMailSender;
  private final SpringTemplateEngine springTemplateEngine;

  public MailServiceImpl(JavaMailSender javaMailSender,
      SpringTemplateEngine springTemplateEngine) {

    this.javaMailSender = javaMailSender;
    this.springTemplateEngine = springTemplateEngine;
  }

  public void sendEmailSync(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
    // Prepare message using a Spring helper
    MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
    try {
      MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
      message.setTo(to);
      message.setSubject(subject);
      message.setText(content, isHtml);
      javaMailSender.send(mimeMessage);
    } catch (MailException | MessagingException e) {
      System.out.println("ERROR SEND EMAIL: " + e);
    }
  }

  @Override
  @Async
  public void sendMail(String to, String fullname, String subject, String templateName, Object value) {
    Context context = new Context();

    context.setVariable("name", fullname);
    context.setVariable("otp", value);
    String content = this.springTemplateEngine.process(templateName, context);
    this.sendEmailSync(to, subject, content, false, true);
  }

}
