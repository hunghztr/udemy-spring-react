package com.jwhisper.udemy.helper;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse<T> {
  int status;
  boolean isSuccess;
  Object message;
  private T data;
}
