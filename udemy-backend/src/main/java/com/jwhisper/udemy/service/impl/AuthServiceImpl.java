package com.jwhisper.udemy.service.impl;

import java.security.SecureRandom;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.jwhisper.udemy.dto.auth.LoginRequest;
import com.jwhisper.udemy.dto.auth.LoginResponse;
import com.jwhisper.udemy.dto.auth.RegisterRequest;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.AuthMapper;
import com.jwhisper.udemy.model.Role;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.projection.user.UserDetail;
import com.jwhisper.udemy.repository.RoleRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.AuthService;
import com.jwhisper.udemy.service.MailService;
import com.jwhisper.udemy.service.AuthRedisService;

@Service
public class AuthServiceImpl implements AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthMapper authMapper;
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final SecurityHelper securityHelper;
  private final AuthRedisService redisService;
  @Value("${whisper.jwt.refresh-token-validity-in-seconds}")
  private long refreshTokenExpiration;
  @Value("${whisper.jwt.access-token-validity-in-seconds}")
  private long accessTokenExpiration;
  private final MailService mailService;
  private final RoleRepository roleRepository;

  public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
      AuthMapper authMapper, AuthenticationManagerBuilder authenticationManagerBuilder,
      SecurityHelper securityHelper,
      MailService mailService, RoleRepository roleRepository, AuthRedisService redisService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authMapper = authMapper;
    this.authenticationManagerBuilder = authenticationManagerBuilder;
    this.securityHelper = securityHelper;
    this.mailService = mailService;
    this.roleRepository = roleRepository;
    this.redisService = redisService;
  }

  @Override
  public void register(RegisterRequest request) throws ErrorException {
    if (this.userRepository.existsByUsername(request.getUsername())) {
      throw new ErrorException("Người dùng này đã tồn tại");
    }
    request.setPassword(passwordEncoder.encode(request.getPassword()));
    User user = authMapper.toUser(request);
    Role role = roleRepository.findByName("USER");
    user.setRole(role);
    this.userRepository.save(user);
  }

  @Override
  public LoginResponse login(LoginRequest request) throws BadCredentialsException {
    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
        request.getUsername(), request.getPassword());

    Authentication authentication = authenticationManagerBuilder.getObject()
        .authenticate(authenticationToken);

    if (!authentication.isAuthenticated()) {
      throw new BadCredentialsException("");
    }
    SecurityContextHolder.getContext().setAuthentication(authentication);
    LoginResponse loginResponse = this.setUpLoginResponse(request.getUsername());
    // set cookies
    ResponseCookie cookie = ResponseCookie
        .from("refresh_token", loginResponse.getRefreshToken())
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(refreshTokenExpiration)
        .build();
    loginResponse.setCookie(cookie);
    return loginResponse;
  }

  @Override
  public LoginResponse setUpLoginResponse(String username) {
    LoginResponse response = new LoginResponse();
    Optional<User> currentUserDB = this.userRepository.findByUsername(username);
    if (currentUserDB.isPresent()) {
      // create access token
      String accessToken = this.securityHelper.generateToken(currentUserDB.get(), "access_token");
      response.setAccessToken(accessToken);

      // create refresh token
      String refreshToken = this.securityHelper.generateToken(currentUserDB.get(), "refresh_token");
      response.setRefreshToken(refreshToken);
      // update user redis
      this.redisService.storeRefreshToken(username, refreshToken, refreshTokenExpiration);
    }

    return response;
  }

  @Override
  public ResponseCookie logout(String accessToken,String refreshToken) {
    this.redisService.deleteRefreshToken(refreshToken);
    this.redisService.addBlacklistToken(accessToken, accessTokenExpiration);
    return ResponseCookie
        .from("refresh_token", "")
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(0)
        .build();
  }

  @Override
  public void isValidMail(String mail) throws ErrorException {
    Optional<User> user = this.userRepository.findByUsername(mail);
    if (!user.isPresent())
      throw new ErrorException("Mail này chưa đăng kí tài khoản");
    String otp = this.generateOtp();
    this.redisService.addOtp(mail, otp, 300);
    this.mailService.sendMail(mail, user.get().getFullname(), "Quên mật khẩu", "otp", otp);
  }

  public String generateOtp() {
    SecureRandom random = new SecureRandom();
    return String.valueOf(100000 + random.nextInt(900000));
  }

  @Override
  public ResponseCookie isValidOtp(String otp, String email) throws ErrorException {
    var row = this.redisService.getOtp(email);
    if (!otp.equals(row))
      throw new ErrorException("Mã otp không chính xác");
    this.redisService.deleteOtp(email);
    var optionalUser = this.userRepository.findByUsername(email);
    if (optionalUser.isPresent()) {
      String resetToken = this.redisService.createResetToken(email, 300);
      return ResponseCookie
        .from("reset_token", resetToken)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(300)
        .build();
    }
    return null;
  }

  @Override
  public void changePassword( String token, String password) throws ErrorException {
    String username = this.redisService.getUsernameByResetToken(token);
    if (username == null) {
      throw new ErrorException("Token không hợp lệ hoặc đã hết hạn");
    }
    var optionalUser = this.userRepository.findByUsername(username);
    if (!optionalUser.isPresent())
      throw new ErrorException("Người dùng không tồn tại");
    User user = optionalUser.get();
    user.setPassword(this.passwordEncoder.encode(password));
    this.userRepository.save(user);
    this.redisService.deleteOtp(username);
    this.redisService.deleteRefreshTokenByUsername(username);
    this.redisService.deleteResetToken(token);
  }

  @Override
  public UserDetail getCurrentUser() throws ErrorException {
    String username = this.securityHelper.getCurrentUsername();
    UserDetail userDetail = this.userRepository.findProjectByUsername(username);
    if (userDetail == null) {
      throw new ErrorException("Người dùng không tồn tại");
    }
    return userDetail;
  }

  @Override
  public String refreshToken(String refreshToken) throws ErrorException {
    String username = this.redisService.getUsernameByRefreshToken(refreshToken);
    if (username == null) {
      throw new ErrorException("token không hợp lệ");
    }
    Optional<User> userOpt = this.userRepository.findByUsername(username);
    if (userOpt.isPresent()) {
      String accessToken = this.securityHelper.generateToken(userOpt.get(), "access_token");
      return accessToken;
    }
    throw new ErrorException("Người dùng không tồn tại");
  }
}
