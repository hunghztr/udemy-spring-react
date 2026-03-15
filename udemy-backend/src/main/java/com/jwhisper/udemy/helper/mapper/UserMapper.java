package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.user.UserRequest;
import com.jwhisper.udemy.dto.user.UserResponse;
import com.jwhisper.udemy.dto.user.WalletResponse;
import com.jwhisper.udemy.model.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    User toUser(UserRequest request);
    UserResponse toUserResponse(User user);
    WalletResponse toWalletResponse(User user);
}
