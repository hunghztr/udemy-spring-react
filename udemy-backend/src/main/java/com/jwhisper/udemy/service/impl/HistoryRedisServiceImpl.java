package com.jwhisper.udemy.service.impl;

import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.jwhisper.udemy.service.HistoryRedisService;

@Service
public class HistoryRedisServiceImpl implements HistoryRedisService{
    private static final String HISTORY_PREFIX = "history:";
    private static final int MAX_HISTORY = 10;
    private static final long EXPIRE_DAYS = 30;
    private final RedisTemplate<String,String> redisTemplate;
    public HistoryRedisServiceImpl(RedisTemplate<String,String> redisTemplate){
        this.redisTemplate = redisTemplate;
    }
    
    @Override
    public void set(String key, String value) {
        String redisKey = HISTORY_PREFIX + key;

        // add hoặc update score
        redisTemplate.opsForZSet()
            .add(redisKey, value, System.currentTimeMillis());

        redisTemplate.opsForZSet()
            .removeRange(redisKey, 0, -MAX_HISTORY - 1);

        // set TTL
        redisTemplate.expire(redisKey, EXPIRE_DAYS, TimeUnit.DAYS);
    }

     
    @Override
    public Set<String> getList(String key) {
        String redisKey = HISTORY_PREFIX + key;

        return redisTemplate.opsForZSet()
            .reverseRange(redisKey, 0, MAX_HISTORY - 1);
    }

   
    @Override
    public void delete(String key, String value) {
        redisTemplate.opsForZSet()
            .remove(HISTORY_PREFIX + key, value);
    }

 
    @Override
    public void deleteAll(String key) {
        redisTemplate.delete(HISTORY_PREFIX + key);
    }
}
