package com.jwhisper.udemy.aop;

import java.time.Instant;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.jwhisper.udemy.helper.annotation.LogActivity;
import com.jwhisper.udemy.model.UserActivity;
import com.jwhisper.udemy.repository.UserActivityRepository;
import com.jwhisper.udemy.security.SecurityHelper;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class LogActivityAspect {
    private final SecurityHelper securityHelper;
    private final UserActivityRepository activityRepository;

    public LogActivityAspect(SecurityHelper securityHelper,
                             UserActivityRepository activityRepository) {
        this.securityHelper = securityHelper;
        this.activityRepository = activityRepository;
    }
    @AfterReturning(value = "@annotation(logActivity)",returning = "result")
    public void logActivity(JoinPoint joinPoint,
                            LogActivity logActivity) {

        try {
            String username = securityHelper.getCurrentUsername();
            if("anonymousUser".equals(username)) {
                return; // không log nếu chưa đăng nhập
            }
            UserActivity activity = new UserActivity();
            activity.setUsername(username);
            activity.setAction(logActivity.action());
            activity.setResource(logActivity.resource());
            activity.setCreatedAt(Instant.now());

            // lấy resourceId nếu có
            int index = logActivity.resourceIdIndex();
            if (index >= 0) {
                Object[] args = joinPoint.getArgs();
                if (index < args.length && args[index] != null) {
                    activity.setResourceId(args[index].toString());
                }
            }

            activityRepository.save(activity);
            log.info(activity.toString());
        } catch (Exception e) {
            log.error("Failed to log activity: {}", e.getMessage());
        }
    }
}
