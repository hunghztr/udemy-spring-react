package com.jwhisper.udemy.service.impl;

import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jwhisper.udemy.service.HomeRedisService;

@Service
public class HomeRedisServiceImpl implements HomeRedisService {
    private final RedisTemplate<String,Object> redisTemplate;
    private final ObjectMapper objectMapper;
    public HomeRedisServiceImpl(RedisTemplate<String,Object> redisTemplate,
        ObjectMapper objectMapper
    ){
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }
    @Override
    public void set(String key, Object value, long ttlSeconds) {
        this.redisTemplate.opsForValue().set(key, value, ttlSeconds,TimeUnit.HOURS);
    }
    @Override
   public <T> T get(String key, TypeReference<T> typeRef) {
      Object val = redisTemplate.opsForValue().get(key);
      if (val == null) return null;
      return objectMapper.convertValue(val, typeRef);
   }

    @Override
    public void delete(String key) {
        this.redisTemplate.delete(key);
    }

    @Override
    public void deleteByPattern(String pattern) {
        Set<String> keys = this.redisTemplate.keys(pattern);
        if (keys != null && !keys.isEmpty()) {
            this.redisTemplate.delete(keys);
        }
    }

    
}
