package com.jwhisper.udemy.service.impl;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.user.ProfileRequest;
import com.jwhisper.udemy.dto.user.UserRequest;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.UserMapper;
import com.jwhisper.udemy.model.Role;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.user.UserDetail;
import com.jwhisper.udemy.projection.user.UserProject;
import com.jwhisper.udemy.repository.RoleRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final RoleRepository roleRepository;
  public UserServiceImpl(UserRepository userRepository,
      UserMapper userMapper,RoleRepository roleRepository
  ) {
    this.userRepository = userRepository;
    this.userMapper = userMapper;
    this.roleRepository = roleRepository;
  }

  @Override
  public User findOriginByUsername(String username) {
    Optional<User> uOptional = this.userRepository.findByUsername(username);
    if (uOptional.isPresent()) {
      return uOptional.get();
    }
    return null;
  }

  @Override
  public Pagination<UserProject> getAll(Pageable pageable,boolean isActive,String keyword)  {
    Pagination<UserProject> pagignation = new Pagination<>();
    Pagination.Meta meta = new Pagination.Meta();
    Page<UserProject> userPage = this.userRepository.findAllByIsActiveAndUsernameContaining(isActive, keyword, pageable);
    pagignation.setElements(userPage.getContent());
    meta.setCurrentPage(userPage.getNumber());
    meta.setPageSize(userPage.getSize());
    meta.setElementTotals(userPage.getTotalElements());
    meta.setPageTotals(userPage.getTotalPages());
    pagignation.setMeta(meta);
    return pagignation;
  }

  @Override
  public boolean create(UserRequest request)  {
    if(this.userRepository.existsByUsername(request.getUsername())){
      throw new ErrorException("Người dùng đã tồn tại");
    }
    this.userRepository.save(userMapper.toUser(request));
    return true;
  }

  @Override
  public boolean update(UserRequest request)  {
    if(this.userRepository.existsByUsernameAndIdNot(request.getUsername(), request.getId())){
      throw new ErrorException("Username đã có người dùng");
    }
    Optional<User> optionalUser = this.userRepository.findById(request.getId());
    if(!optionalUser.isPresent() || !optionalUser.get().getIsActive()){
      throw new ErrorException("Người dùng không tồn tại hoặc đã bị vô hiệu hoá");
    }
    User selectedUser = optionalUser.get();
      selectedUser.setUsername(request.getUsername());
      selectedUser.setFullname(request.getFullname());
      selectedUser.setRole(request.getRole());
      this.userRepository.save(selectedUser);
      return true;
  }

  @Override
  public UserProject get(String id)  {
    UserProject userProject = this.userRepository.findProjectById(id);
    if(userProject == null) throw new ErrorException("Người dùng không tồn tại");
    return userProject;
  }

  @Override
  public boolean delete(String id)  {
    var optionalUser = this.userRepository.findById(id);
    if(!optionalUser.isPresent() || !optionalUser.get().getIsActive()){
        throw new ErrorException("Người dùng không tồn tại hoặc đã bị vô hiệu hoá");
    }
    User user = optionalUser.get();
    user.setIsActive(false);
    this.userRepository.save(user);
    return true;
  }

  @Override
  public boolean active(String id)  {
    var optionalUser = this.userRepository.findById(id);
    if(!optionalUser.isPresent() || optionalUser.get().getIsActive()){
        throw new ErrorException("Người dùng không tồn tại hoặc đã chưa bị vô hiệu hoá");
    }
    User user = optionalUser.get();
    user.setIsActive(true);
    this.userRepository.save(user);
    return true;
  }

  @Override
  public boolean updateProfile(ProfileRequest request)  {
    Optional<User> optionalUser = this.userRepository.findById(request.getId());
    if(!optionalUser.isPresent() || !optionalUser.get().getIsActive()){
      throw new ErrorException("Người dùng không tồn tại hoặc đã bị vô hiệu hoá");
    }
    User selectedUser = optionalUser.get();
    if(request.getRoleName() == "ADMIN") throw new ErrorException("Không thể đổi role");
    Role role = this.roleRepository.findByName(request.getRoleName());
    if(role == null) throw new ErrorException("Vai trò không tồn tại");
    selectedUser.setRole(role);
    selectedUser.setFullname(request.getFullname());
    selectedUser.setDescription(request.getDescription());
    selectedUser.setAvatarPath(request.getAvatarPath());
    this.userRepository.save(selectedUser);
    return true;
  }

  @Override
  public UserProject getByCourseId(String courseId) {
      UserProject userProject = this.userRepository.findProjectByCourses_Id(courseId);
      if(userProject == null) throw new ErrorException("Người dùng không tồn tại với khoá học này");
      return userProject;
  }

  @Override
  public UserDetail getProfile(String id) {
    UserDetail userDetail = this.userRepository.findProjectionById(id);
    if(userDetail == null) throw new ErrorException("Người dùng không tồn tại");
    return userDetail;
  }

}
