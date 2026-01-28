package com.jwhisper.udemy.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.expception.ErrorException;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/v1")
class HelloController {

  @GetMapping("/hello")
  @ApiMessage("gọi api thành công")
  public String hello() throws ErrorException {

    return "Hello, World!, ";
  }

  @GetMapping("/hello-admin")
  public String helloAdmin() {
    return "Hello, Admin!";
  }

  @GetMapping("/hello-user")
  public String helloUser() {
    return "Hello, User!";
  }

 
}