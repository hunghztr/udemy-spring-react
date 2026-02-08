package com.jwhisper.udemy.service;

import java.util.Set;

public interface HistoryRedisService {
    void set(String key,String value);
    Set<String> getList(String key);
    void delete(String key,String value);
    void deleteAll(String key);
}
