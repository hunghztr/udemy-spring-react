package com.jwhisper.udemy.projection.user;

import org.springframework.beans.factory.annotation.Value;

public interface UserProject {
    String getId();

    String getUsername();

    String getFullname();

    @Value("#{target.role.name}")
    String getRoleName();
}
