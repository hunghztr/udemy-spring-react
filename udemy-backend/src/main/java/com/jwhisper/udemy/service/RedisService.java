package com.jwhisper.udemy.service;

public interface RedisService {
  void storeRefreshToken(String username, String token, long ttlSeconds);

  String getRefreshToken(String username);

  void deleteRefreshToken(String username);

  void addBlacklistToken(String jwt, long ttlSeconds);

  boolean isTokenBlacklisted(String jwt);

  void addOtp(String email, String otp, long ttlSeconds);

  String getOtp(String email);

  void deleteOtp(String email);

  String createResetToken(String email, long ttlSeconds);

  String getResetToken(String email);

  void deleteResetToken(String email);

  String getUsernameByRefreshToken(String refreshToken);
}
