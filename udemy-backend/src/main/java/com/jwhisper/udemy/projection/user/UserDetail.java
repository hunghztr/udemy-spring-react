package com.jwhisper.udemy.projection.user;

import org.springframework.beans.factory.annotation.Value;

public interface UserDetail {
  String getId();

  String getUsername();

  String getFullname();

  String getAvatarPath();

  String getDescription();
  
  @Value("#{target.role.name}")
  String getRoleName();
}
