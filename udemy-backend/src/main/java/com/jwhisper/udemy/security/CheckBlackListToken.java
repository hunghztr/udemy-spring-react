package com.jwhisper.udemy.security;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

import com.jwhisper.udemy.service.RedisService;

public class CheckBlackListToken implements JwtDecoder {

  private final JwtDecoder delegate;
  private final RedisService redisService;

  public CheckBlackListToken(JwtDecoder delegate,
      RedisService redisService) {
    this.delegate = delegate;
    this.redisService = redisService;
  }

  @Override
  public Jwt decode(String token) throws JwtException {
    try {
      if (this.redisService.isTokenBlacklisted(token)) {
        throw new JwtException("Token không hợp lệ");
      }
      return delegate.decode(token);
    } catch (JwtException ex) {
      System.out.println("Token invalid: " + ex.getMessage());
      throw ex;
    }
  }

}
