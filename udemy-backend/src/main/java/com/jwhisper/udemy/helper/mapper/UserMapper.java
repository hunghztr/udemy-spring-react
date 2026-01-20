package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.user.UserRequest;
import com.jwhisper.udemy.model.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    User toUser(UserRequest request);
}
