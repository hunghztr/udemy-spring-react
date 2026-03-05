package com.jwhisper.udemy.redis.impl;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.redis.AuthRedisService;

import org.springframework.data.redis.core.RedisTemplate;

@Service
public class AuthRedisServiceImpl implements AuthRedisService {
  private final String REFRESH_PREFIX = "refresh:";
  private final String USER_PREFIX = "user:";
  private final String BLACKLIST_PREFIX = "blacklist:";
  private final String OTP_PREFIX = "otp:";
  private final String RESET_PREFIX = "reset:";
  private final RedisTemplate<String, String> redisTemplate;

  public AuthRedisServiceImpl(RedisTemplate<String, String> redisTemplate) {
    this.redisTemplate = redisTemplate;
  }

  @Override
  public void storeRefreshToken(String username, String token, long ttlSeconds) {
    this.redisTemplate
        .opsForValue()
        .set(REFRESH_PREFIX + token, username, ttlSeconds, TimeUnit.SECONDS);
        this.redisTemplate.opsForSet().add(USER_PREFIX+username, token);
  }

  @Override
  public String getRefreshToken(String username) {
    return this.redisTemplate
        .opsForValue()
        .get(REFRESH_PREFIX + username);
  }

  @Override
  public void deleteRefreshToken(String refreshToken) {
    String username = this.redisTemplate.opsForValue().get(REFRESH_PREFIX+refreshToken);
    this.redisTemplate.delete(REFRESH_PREFIX + refreshToken);
    this.redisTemplate.opsForSet().remove(USER_PREFIX+username,refreshToken);
  }

  @Override
  public void addBlacklistToken(String jwt, long ttlSeconds) {
    this.redisTemplate
        .opsForValue()
        .set(BLACKLIST_PREFIX + jwt, "1", ttlSeconds, TimeUnit.SECONDS);
  }

  @Override
  public boolean isTokenBlacklisted(String jwt) {
    return this.redisTemplate
        .opsForValue()
        .get(BLACKLIST_PREFIX + jwt) != null;
  }

  @Override
  public void addOtp(String email, String otp, long ttlSeconds) {
    this.redisTemplate
        .opsForValue()
        .set(this.OTP_PREFIX + email, otp, 300, TimeUnit.SECONDS);
  }

  @Override
  public String getOtp(String email) {
    return this.redisTemplate
        .opsForValue()
        .get(this.OTP_PREFIX + email);
  }

  @Override
  public void deleteOtp(String email) {
    this.redisTemplate
        .delete(this.OTP_PREFIX + email);
  }

  @Override
  public String createResetToken(String email, long ttlSeconds) {
    String token = generateSecureToken();
    this.redisTemplate.opsForValue().set(RESET_PREFIX + token, email, ttlSeconds, TimeUnit.SECONDS);
    return token;
  }

  private String generateSecureToken() {
    SecureRandom secureRandom = new SecureRandom();
    byte[] bytes = new byte[64]; // 512-bit
    secureRandom.nextBytes(bytes);

    return Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(bytes);
  }

  @Override
  public String getUsernameByResetToken(String token) {
    return this.redisTemplate
        .opsForValue()
        .get(RESET_PREFIX + token);
  }

  @Override
  public void deleteResetToken(String token) {
    this.redisTemplate.delete(RESET_PREFIX + token);
  }

  @Override
  public String getUsernameByRefreshToken(String refreshToken) {
    return this.redisTemplate.opsForValue().get(REFRESH_PREFIX + refreshToken);
  }

  @Override
  public void deleteRefreshTokenByUsername(String username) {
      Set<String> tokens = this.redisTemplate.opsForSet().members(USER_PREFIX+username);
      if(tokens != null && !tokens.isEmpty()){
        tokens.forEach(t -> this.redisTemplate.delete(REFRESH_PREFIX+t));
        this.redisTemplate.delete(USER_PREFIX+username);
      }
  }

}
