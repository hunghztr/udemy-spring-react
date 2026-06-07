package com.jwhisper.udemy.service;


import java.time.LocalDate;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.user.BankRequest;
import com.jwhisper.udemy.dto.user.BankResponse;
import com.jwhisper.udemy.dto.user.InstructorProfileResponse;
import com.jwhisper.udemy.dto.user.ProfileRequest;
import com.jwhisper.udemy.dto.user.UserRequest;
import com.jwhisper.udemy.dto.user.WalletResponse;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.user.UserProject;

public interface UserService {
  User findOriginByUsername(String username);
  Pagination<UserProject> getAll(Pageable pageable,boolean isActive,String keyword);
  boolean create(UserRequest user);
  boolean update(UserRequest user);
  boolean delete(String id);
  boolean active(String id);
  UserProject get(String id);
  UserProject getByCourseId(String courseId);
  boolean updateProfile(ProfileRequest request);
  InstructorProfileResponse getProfile(String id);
  BankResponse getPay(LocalDate startDate, LocalDate endDate);
  void connectWallet(BankRequest request);
  Pagination<WalletResponse> getAllWallet(
          Pageable pageable,
          LocalDate startDate,
          LocalDate endDate
  );
  WalletResponse getWallet(String userId);
}
