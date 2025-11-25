package com.jwhisper.udemy.service;

import com.jwhisper.udemy.model.User;

public interface UserService {
  User findOriginByUsername(String username);

}
