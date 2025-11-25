package com.jwhisper.udemy.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.jwhisper.udemy.service.UserService;

@Component
public class CustomUserDetail implements UserDetailsService {
  private final UserService userService;

  public CustomUserDetail(UserService userService) {
    this.userService = userService;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    var user = userService.findOriginByUsername(username);
    if (user == null) {
      throw new UsernameNotFoundException("");
    }

    return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName())));
  }

}
