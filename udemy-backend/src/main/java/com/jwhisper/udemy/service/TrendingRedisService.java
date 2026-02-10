package com.jwhisper.udemy.service;

import java.util.Set;

public interface TrendingRedisService {
    void recordKeyword(String keyword);
    Set<String> getTrendingKeywords(int limit);
    Set<String> getTrendingByKeyword(String value,int limit);
    void decay();
}
