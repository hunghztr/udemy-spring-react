package com.jwhisper.udemy.aop;

import java.lang.reflect.Field;
import java.time.Instant;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

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

    @AfterReturning(
        value = "@annotation(logActivity)",
        returning = "result"
    )
    public void logActivity(
            JoinPoint joinPoint,
            LogActivity logActivity,
            Object result
    ) {

        try {
            String username = securityHelper.getCurrentUsername();
            if ("anonymousUser".equals(username)) {
                return;
            }

            UserActivity activity = new UserActivity();
            activity.setUsername(username);
            activity.setAction(logActivity.action());
            activity.setResource(logActivity.resource());
            activity.setCreatedAt(Instant.now());

            // lấy id từ kết quả trả về
            String resourceId =
                    extractResourceId(result, logActivity.resourceIdField());

            // lấy id từ tham số method
            // if (resourceId == null && logActivity.resourceIdIndex() >= 0) {
            //     Object[] args = joinPoint.getArgs();
            //     int index = logActivity.resourceIdIndex();
            //     if (index < args.length && args[index] != null) {
            //         resourceId = args[index].toString();
            //     }
            // }

            activity.setResourceId(resourceId);
            activityRepository.save(activity);
            log.info(activity.toString());
        } catch (Exception e) {
            log.error("Failed to log activity", e);
        }
    }


    private String extractResourceId(Object result, String fieldName) {
        if (result == null) return null;

        try {
            Field field = ReflectionUtils.findField(result.getClass(), fieldName);
            if (field == null) return null;

            field.setAccessible(true);
            Object value = field.get(result);
            return value != null ? value.toString() : null;

        } catch (Exception e) {
            return null;
        }
    }
}