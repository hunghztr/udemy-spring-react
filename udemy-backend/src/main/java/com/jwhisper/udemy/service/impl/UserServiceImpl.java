package com.jwhisper.udemy.service.impl;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.user.UserProject;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;

  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
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
  public Pagination<UserProject> getAll(Pageable pageable,boolean isActive,String keyword) throws ErrorException {
    Pagination<UserProject> pagignation = new Pagination<>();
    Pagination.Meta meta = new Pagination.Meta();
    Page<UserProject> userPage = this.userRepository.findAllByIsActiveAndUsernameContaining(isActive, keyword, pageable);
    log.info(userPage.getContent().size()+"");
    if(userPage.getContent() == null || userPage.getContent().size() == 0)
      throw new ErrorException("Danh sách người dùng rỗng");
    pagignation.setElements(userPage.getContent());
    meta.setCurrentPage(userPage.getNumber());
    meta.setPageSize(userPage.getSize());
    meta.setElementTotals(userPage.getTotalElements());
    meta.setPageTotals(userPage.getTotalPages());
    pagignation.setMeta(meta);
    return pagignation;
  }

  @Override
  public boolean create(User user) throws ErrorException {
    if(this.userRepository.existsByUsername(user.getUsername())){
      throw new ErrorException("Người dùng đã tồn tại");
    }
    this.userRepository.save(user);
    return true;
  }

  @Override
  public boolean update(User user) throws ErrorException {
    if(this.userRepository.existsByUsernameAndIdNot(user.getUsername(), user.getId())){
      throw new ErrorException("Username đã có người dùng");
    }
    Optional<User> optionalUser = this.userRepository.findById(user.getId());
    if(!optionalUser.isPresent() || !optionalUser.get().isActive()){
      throw new ErrorException("Người dùng không tồn tại hoặc đã bị vô hiệu hoá");
    }
    User selectedUser = optionalUser.get();
      selectedUser.setUsername(user.getUsername());
      selectedUser.setFullname(user.getFullname());
      selectedUser.setRole(user.getRole());
      this.userRepository.save(selectedUser);
      return true;
  }

  @Override
  public UserProject getDetail(String id) throws ErrorException {
    UserProject userProject = this.userRepository.findProjectById(id);
    if(userProject == null) throw new ErrorException("Người dùng không tồn tại");
    return userProject;
  }

  @Override
  public boolean delete(String id) throws ErrorException {
    var optionalUser = this.userRepository.findById(id);
    if(!optionalUser.isPresent() || !optionalUser.get().isActive()){
        throw new ErrorException("Người dùng không tồn tại hoặc đã bị vô hiệu hoá");
    }
    User user = optionalUser.get();
    user.setActive(false);
    this.userRepository.save(user);
    return true;
  }

  @Override
  public boolean active(String id) throws ErrorException {
    var optionalUser = this.userRepository.findById(id);
    if(!optionalUser.isPresent() || optionalUser.get().isActive()){
        throw new ErrorException("Người dùng không tồn tại hoặc đã chưa bị vô hiệu hoá");
    }
    User user = optionalUser.get();
    user.setActive(true);
    this.userRepository.save(user);
    return true;
  }

  

}
