package com.jwhisper.udemy.helper.expception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jwhisper.udemy.helper.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements
    AuthenticationEntryPoint {

  private final ObjectMapper mapper;

  public CustomAuthenticationEntryPoint(ObjectMapper mapper) {
    this.mapper = mapper;
  }

  @Override
public void commence(HttpServletRequest request, HttpServletResponse response,
    AuthenticationException authException) throws IOException {

  response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // ⭐ RẤT QUAN TRỌNG
  response.setContentType("application/json;charset=UTF-8");

  ApiResponse<Object> res = new ApiResponse<>();
  res.setStatus(HttpStatus.UNAUTHORIZED.value());
  res.setSuccess(false);
  res.setMessage("Token không hợp lệ (hết hạn, không đúng định dạng, hoặc không truyền JWT ở header)...");

  mapper.writeValue(response.getWriter(), res);
}

}