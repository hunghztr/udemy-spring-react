package com.jwhisper.udemy.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jwhisper.udemy.helper.annotation.CheckPermission;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;

@Aspect
@Component
public class PermissionAspect {

    @Autowired
    private SecurityHelper securityHelper;

    @Autowired
    private UserRepository userRepository;

    @Before("@annotation(checkPermission)")
    public void check(JoinPoint joinPoint, CheckPermission checkPermission) {

        String username = securityHelper.getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

        boolean hasPermission = user.getRole()
                .getPermissions()
                .stream()
                .anyMatch(p -> p.getName().equals(checkPermission.value()));

        if (!hasPermission) {
            throw new ErrorException("Bạn không có quyền truy cập vào tài nguyên này ,"+checkPermission.value());
        }
    }
}