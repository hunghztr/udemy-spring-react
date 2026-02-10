package com.jwhisper.udemy.service.impl;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.service.TrendingRedisService;

@Service
public class TrendingRedisServiceImpl implements TrendingRedisService{
    private static final String FAST_KEY = "trending:keyword:fast";
    private static final String SLOW_KEY = "trending:keyword:slow";

    private static final double FAST_WEIGHT = 1.0;
    private static final double SLOW_WEIGHT = 0.3;

    private static final double FAST_DECAY = 0.8;
    private static final double SLOW_DECAY = 0.97;

    private final RedisTemplate<String, String> redisTemplate;


    public TrendingRedisServiceImpl(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void recordKeyword(String keyword) {
        String kw = normalize(keyword);

        redisTemplate.opsForZSet().incrementScore(FAST_KEY, kw, 1);
        redisTemplate.opsForZSet().incrementScore(SLOW_KEY, kw, 1);
    }

    private String normalize(String keyword) {
        return keyword.toLowerCase().trim().replaceAll("\\s+", " ");
    }

    @Override
    // @Scheduled(cron = "0 * * * * *")
    public void decay() {
        decayKey(FAST_KEY, FAST_DECAY);
        decayKey(SLOW_KEY, SLOW_DECAY);
    }

    private void decayKey(String key, double factor) {
        Set<ZSetOperations.TypedTuple<String>> items =
            redisTemplate.opsForZSet().rangeWithScores(key, 0, -1);

        if (items == null || items.isEmpty()) return;

        for (var item : items) {
            double newScore = item.getScore() * factor;

            if (newScore < 0.1) {
                redisTemplate.opsForZSet().remove(key, item.getValue());
            } else {
                redisTemplate.opsForZSet()
                    .add(key, item.getValue(), newScore);
            }
        }
    }

    // ============== READ API ===================

    @Override
    public Set<String> getTrendingKeywords(int limit) {
        Set<String> fast =
            redisTemplate.opsForZSet()
                .reverseRange(FAST_KEY, 0, limit * 3);

        if (fast == null || fast.isEmpty()) return Set.of();

        return fast.stream()
            .filter(f -> score(f) >= 3)  // điểm >= 3 mới tính là trending
            .sorted((a, b) -> Double.compare(score(b), score(a)))
            .limit(limit)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private double score(String keyword) {
        Double fast = redisTemplate.opsForZSet().score(FAST_KEY, keyword);
        Double slow = redisTemplate.opsForZSet().score(SLOW_KEY, keyword);

        return FAST_WEIGHT * (fast == null ? 0 : fast)
             + SLOW_WEIGHT * (slow == null ? 0 : slow);
    }

    @Override
    public Set<String> getTrendingByKeyword(String value,int limit) {
        Set<String> fast =
            redisTemplate.opsForZSet()
                .reverseRange(FAST_KEY, 0, limit * 3);

        if (fast == null || fast.isEmpty()) return Set.of();

        return fast.stream()
            .filter(f -> value.contains(f))
            .sorted((a, b) -> Double.compare(score(b), score(a)))
            .limit(limit)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
