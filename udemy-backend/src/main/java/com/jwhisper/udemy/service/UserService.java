package com.jwhisper.udemy.service;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.user.ProfileRequest;
import com.jwhisper.udemy.dto.user.UserRequest;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.user.UserProject;

public interface UserService {
  User findOriginByUsername(String username);
  Pagination<UserProject> getAll(Pageable pageable,boolean isActive,String keyword) throws ErrorException;
  boolean create(UserRequest user) throws ErrorException;
  boolean update(UserRequest user) throws ErrorException;
  boolean delete(String id) throws ErrorException;
  boolean active(String id) throws ErrorException;
  UserProject get(String id) throws ErrorException;
  boolean updateProfile(ProfileRequest request) throws ErrorException;
}
