package com.jwhisper.udemy.middleware;

import java.util.List;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.Permission;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

public class Interceptor implements HandlerInterceptor {
  private final SecurityHelper securityHelper;
  private final UserRepository userRepository;

  public Interceptor(SecurityHelper securityHelper, UserRepository userRepository) {
    this.securityHelper = securityHelper;
    this.userRepository = userRepository;
  }

  @Override
  @Transactional
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
    String requestURI = request.getRequestURI();
    String httpMethod = request.getMethod();
    System.out.println(">>> RUN preHandle");
    System.out.println(">>> path= " + path);
    System.out.println(">>> httpMethod= " + httpMethod);
    System.out.println(">>> requestURI= " + requestURI);
    String username = this.securityHelper.getCurrentUsername();
    var optionalUser = this.userRepository.findByUsername(username);
    if (optionalUser.isPresent()) {
      List<Permission> permissions = optionalUser.get().getRole().getPermissions();
      boolean isAuthenticated = permissions.stream()
          .anyMatch(i -> i.getMethod().equals(httpMethod) && i.getPath().equals(path));
      if (!isAuthenticated) {
        throw new ErrorException("Bạn không có quyền hạn truy cập vào tài nguyên này");
      }
    } else {
      throw new ErrorException("Bạn không có quyền hạn truy cập vào tài nguyên này");
    }
    return true;
  }
}
