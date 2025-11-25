package com.jwhisper.udemy.service.impl;

import java.util.Optional;
import org.springframework.stereotype.Service;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.service.UserService;

@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;

  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public User findOriginByUsername(String username) {
    Optional<User> uOptional = this.userRepository.findByUsername(username);
    if (uOptional.isPresent()) {
      return uOptional.get();
    }
    return null;
  }

}
