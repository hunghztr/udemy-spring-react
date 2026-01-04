package com.jwhisper.udemy.helper.expception;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.jwhisper.udemy.helper.ApiResponse;

import io.swagger.v3.oas.annotations.Hidden;

@RestControllerAdvice
@Hidden
public class GlobalException {
  @ExceptionHandler({ ErrorException.class,
      BadCredentialsException.class })

  public ResponseEntity<?> handleException(Exception ex) {
    ApiResponse<Object> apiResponse = new ApiResponse<>();
    apiResponse.setMessage(ex.getMessage());
    apiResponse.setData(null);
    HttpStatus status = HttpStatus.BAD_REQUEST;

    if (ex instanceof BadCredentialsException) {
      status = HttpStatus.UNAUTHORIZED; // 401
      apiResponse.setMessage("Sai tài khoản hoặc mật khẩu");
    }
    else if (ex instanceof org.springframework.web.server.ResponseStatusException rse) {
        status = HttpStatus.valueOf(rse.getStatusCode().value());
        apiResponse.setMessage(rse.getReason());
    }
    apiResponse.setStatus(status.value());
    apiResponse.setSuccess(false);
    return ResponseEntity.status(status).body(apiResponse);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> validationError(MethodArgumentNotValidException ex) {
    BindingResult result = ex.getBindingResult();
    final List<FieldError> fieldErrors = result.getFieldErrors();

    ApiResponse<Object> res = new ApiResponse<>();
    res.setStatus(HttpStatus.BAD_REQUEST.value());

    List<String> errors = fieldErrors.stream().map(f -> f.getDefaultMessage()).collect(Collectors.toList());
    res.setMessage(errors.size() > 1 ? errors : errors.get(0));

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
  }
}
