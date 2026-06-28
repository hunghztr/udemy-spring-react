package com.jwhisper.udemy.service.impl;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.user.BankRequest;
import com.jwhisper.udemy.dto.user.BankResponse;
import com.jwhisper.udemy.dto.user.InstructorProfileResponse;
import com.jwhisper.udemy.dto.user.ProfileRequest;
import com.jwhisper.udemy.dto.user.UserRequest;
import com.jwhisper.udemy.dto.user.WalletResponse;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.UserMapper;
import com.jwhisper.udemy.model.InstructorPayout;
import com.jwhisper.udemy.model.Role;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.user.UserProject;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.InstructorPayoutRepository;
import com.jwhisper.udemy.repository.RoleRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final RoleRepository roleRepository;
  private final SecurityHelper securityHelper;
  private final InstructorPayoutRepository instructorPayoutRepository;
  private final CourseRepository courseRepository;
  public UserServiceImpl(UserRepository userRepository,
      UserMapper userMapper,RoleRepository roleRepository, SecurityHelper securityHelper,
      InstructorPayoutRepository instructorPayoutRepository,
      CourseRepository courseRepository
  ) {
    this.userRepository = userRepository;
    this.userMapper = userMapper;
    this.roleRepository = roleRepository;
    this.securityHelper = securityHelper;
    this.instructorPayoutRepository = instructorPayoutRepository;
    this.courseRepository = courseRepository;
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
  public InstructorProfileResponse getProfile(String id) {
      User user = userRepository.findById(id)
          .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

      long totalCourses  = courseRepository.countByAuthorId(id);
      long totalStudents = courseRepository.sumSoldByAuthorId(id);
      double avgRating   = courseRepository.avgStarByAuthorId(id);

      return InstructorProfileResponse.builder()
          .id(user.getId())
          .fullname(user.getFullname())
          .avatarPath(user.getAvatarPath())
          .description(user.getDescription())
          .roleName(user.getRole().getName())
          .totalCourses(totalCourses)
          .totalStudents(totalStudents)
          .avgRating(Math.floor(avgRating * 100.0) / 100.0)
          .build();
  }

  @Override
  public BankResponse getPay(LocalDate startDate, LocalDate endDate) {

      String username = this.securityHelper.getCurrentUsername();

      User user = this.userRepository.findByUsername(username)
              .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));

      Instant startInstant = null;
      Instant endInstant = null;

      if (startDate != null) {
          startInstant = startDate
                  .atStartOfDay(ZoneId.systemDefault())
                  .toInstant();
      }

      if (endDate != null) {
          endInstant = endDate
                  .atTime(LocalTime.MAX)
                  .atZone(ZoneId.systemDefault())
                  .toInstant();
      }

      List<InstructorPayout> instructorPayouts;

      if (startInstant != null && endInstant != null) {
          instructorPayouts = this.instructorPayoutRepository
                  .findAllByInstructorAndCreatedAtBetween(user, startInstant, endInstant);
      } else {
          instructorPayouts = this.instructorPayoutRepository
                  .findAllByInstructor(user);
      }

      Double amount = instructorPayouts.stream()
              .mapToDouble(InstructorPayout::getAmount)
              .sum();

      BankResponse response = new BankResponse();
      response.setId(user.getId());
      response.setAccount(user.getAccount());
      response.setBankName(user.getBankName());
      response.setAmount(amount);

      return response;
  }

  @Override
  public void connectWallet(BankRequest request) {
    String username = this.securityHelper.getCurrentUsername();
    User user = this.userRepository.findByUsername(username)
    .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));
    user.setAccount(request.getAccount());
    user.setBankName(request.getBankName());
    this.userRepository.save(user);
  }

  @Override
  public Pagination<WalletResponse> getAllWallet(
            Pageable pageable,
            LocalDate startDate,
            LocalDate endDate
    ) {

      Page<User> page = this.userRepository.findAll(pageable);

      Instant startInstant = null;
      Instant endInstant = null;

      if (startDate != null) {
          startInstant = startDate
                  .atStartOfDay(ZoneId.systemDefault())
                  .toInstant();
      }

      if (endDate != null) {
          endInstant = endDate
                  .atTime(LocalTime.MAX)
                  .atZone(ZoneId.systemDefault())
                  .toInstant();
      }

      final Instant finalStartInstant = startInstant;
      final Instant finalEndInstant = endInstant;

            List<WalletResponse> wallets = page.stream().map(user -> {

          Double amount;

          if (finalStartInstant != null && finalEndInstant != null) {
              amount = instructorPayoutRepository
                      .sumAmountByInstructorAndDate(user, finalStartInstant, finalEndInstant);
          } else {
              amount = instructorPayoutRepository
                      .sumAmountByInstructor(user);
          }

          WalletResponse res = userMapper.toWalletResponse(user);
          res.setAmount(amount);

          return res;

      }).toList();

      Pagination<WalletResponse> pagination = new Pagination<>();
      pagination.setElements(wallets);

      return pagination;
  }

  @Override
  public WalletResponse getWallet(String userId) {
    User user = this.userRepository.findById(userId)
    .orElseThrow(() -> new ErrorException("Người dùng không tồn tại"));
    List<InstructorPayout> instructorPayouts = this.instructorPayoutRepository.findAllByInstructor(user);
    Double amount = instructorPayouts.stream()
        .mapToDouble(InstructorPayout::getAmount)
        .sum();
    var wallet = this.userMapper.toWalletResponse(user);
    wallet.setAmount(amount);
    return wallet;
  }

}
