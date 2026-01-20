package com.jwhisper.udemy.service;

public interface AuthRedisService {
  void storeRefreshToken(String username, String token, long ttlSeconds);

  String getRefreshToken(String username);

  void deleteRefreshToken(String refreshToken);
  
  void deleteRefreshTokenByUsername(String username);

  void addBlacklistToken(String jwt, long ttlSeconds);

  boolean isTokenBlacklisted(String jwt);

  void addOtp(String email, String otp, long ttlSeconds);

  String getOtp(String email);

  void deleteOtp(String email);

  String createResetToken(String email, long ttlSeconds);

  String getUsernameByResetToken(String token);

  void deleteResetToken(String token);

  String getUsernameByRefreshToken(String refreshToken);
}
