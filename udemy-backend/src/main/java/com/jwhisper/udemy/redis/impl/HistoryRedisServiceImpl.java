package com.jwhisper.udemy.redis.impl;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.redis.HistoryRedisService;

@Service
public class HistoryRedisServiceImpl implements HistoryRedisService{
    private static final String HISTORY_PREFIX = "history:";
    
    private static final int MAX_HISTORY = 5;
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

    @Override
    public Set<String> getListByKeyword(String key, String keyword) {
        String redisKey = HISTORY_PREFIX + key;
        String kw = normalize(keyword);

        Set<String> all =
            redisTemplate.opsForZSet()
                .reverseRange(redisKey, 0, MAX_HISTORY - 1);

        if (all == null || all.isEmpty()) return Set.of();

        return all.stream()
            .filter(v -> v.contains(kw))
            .limit(5)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private String normalize(String keyword) {
        return keyword.toLowerCase().trim().replaceAll("\\s+", " ");
    }

}
