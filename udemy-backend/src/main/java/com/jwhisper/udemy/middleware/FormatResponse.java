package com.jwhisper.udemy.middleware;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.jwhisper.udemy.helper.ApiResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;

import io.swagger.v3.oas.annotations.Hidden;

@ControllerAdvice
@Hidden
public class FormatResponse implements ResponseBodyAdvice<Object> {
  @Override
  public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
    return AbstractJackson2HttpMessageConverter.class.isAssignableFrom(converterType)
        && returnType.hasMethodAnnotation(ApiMessage.class);
  }

  @Override
  public Object beforeBodyWrite(Object body, MethodParameter returnType,
      MediaType selectedContentType,
      Class<? extends HttpMessageConverter<?>> selectedConverterType,
      ServerHttpRequest request,
      ServerHttpResponse response) {
    HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
    int status = servletResponse.getStatus();
    ApiResponse<Object> apiResponse = new ApiResponse<>();
    apiResponse.setStatus(status);

    if (!MediaType.APPLICATION_JSON.equals(selectedContentType)) {
      return body;
    }
    if (status >= 400) {
      return body;
    } else {
      apiResponse.setSuccess(true);
      apiResponse.setData(body);
      ApiMessage message = returnType.getMethodAnnotation(ApiMessage.class);
      apiResponse.setMessage(message.value());
    }
    return apiResponse;
  }
}
