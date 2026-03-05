package com.jwhisper.udemy.redis;

import com.fasterxml.jackson.core.type.TypeReference;

public interface HomeRedisService {
    void set(String key, Object value, long ttlSeconds);
   <T> T get(String key, TypeReference<T> clazz);
   void delete(String key);
   void deleteByPattern(String pattern);
}
