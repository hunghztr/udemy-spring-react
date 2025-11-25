package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.auth.RegisterRequest;
import com.jwhisper.udemy.dto.auth.UserToken;
import com.jwhisper.udemy.model.Role;
import com.jwhisper.udemy.model.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AuthMapper {
  User toUser(RegisterRequest request);

  UserToken toUserToken(User user);

  default String map(Role role) {
    return (role != null) ? role.getName() : null;
  }
}
