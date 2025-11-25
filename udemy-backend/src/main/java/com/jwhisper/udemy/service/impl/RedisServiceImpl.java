package com.jwhisper.udemy.service.impl;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import com.jwhisper.udemy.service.RedisService;
import org.springframework.data.redis.core.RedisTemplate;

@Service
public class RedisServiceImpl implements RedisService {
  private final String REFRESH_PREFIX = "refresh:";
  private final String BLACKLIST_PREFIX = "blacklist:";
  private final String OTP_PREFIX = "otp:";
  private final String RESET_PREFIX = "reset:";
  private final RedisTemplate<String, String> redisTemplate;

  public RedisServiceImpl(RedisTemplate<String, String> redisTemplate) {
    this.redisTemplate = redisTemplate;
  }

  @Override
  public void storeRefreshToken(String username, String token, long ttlSeconds) {
    this.redisTemplate
        .opsForValue()
        .set(REFRESH_PREFIX + username, token, ttlSeconds, TimeUnit.SECONDS);
  }

  @Override
  public String getRefreshToken(String username) {
    return this.redisTemplate
        .opsForValue()
        .get(REFRESH_PREFIX + username);
  }

  @Override
  public void deleteRefreshToken(String username) {
    this.redisTemplate.delete(REFRESH_PREFIX + username);
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
    this.redisTemplate.opsForValue().set(RESET_PREFIX + email, token, ttlSeconds, TimeUnit.SECONDS);
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
  public String getResetToken(String email) {
    return this.redisTemplate
        .opsForValue()
        .get(RESET_PREFIX + email);
  }

  @Override
  public void deleteResetToken(String email) {
    this.redisTemplate.delete(RESET_PREFIX + email);
  }

}
