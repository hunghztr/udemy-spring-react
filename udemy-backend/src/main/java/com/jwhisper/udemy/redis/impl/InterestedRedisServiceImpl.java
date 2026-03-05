package com.jwhisper.udemy.redis.impl;

import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.elasticsearch.document.CourseDocument;
import com.jwhisper.udemy.redis.InterestedRedisService;

@Service
public class InterestedRedisServiceImpl implements InterestedRedisService {
    private final RedisTemplate<String,Object> redisTemplate;
    private static final String INTERESTED_COURSE_KEY_PREFIX = "interested_course:";
    public InterestedRedisServiceImpl(RedisTemplate<String,Object> redisTemplate){
        this.redisTemplate = redisTemplate;
    }
    @Override
    public void setInterestedCourse(String username, List<CourseDocument> elements) {

        String key = INTERESTED_COURSE_KEY_PREFIX + username;

        for (CourseDocument course : elements) {

            // remove duplicate
            redisTemplate.opsForList().remove(key, 0, course);

            // push lại lên đầu
            redisTemplate.opsForList().leftPush(key, course);
        }

        redisTemplate.opsForList().trim(key, 0, 9);

        redisTemplate.expire(key, java.time.Duration.ofDays(30));
    }
    @Override
    public List<CourseDocument> getInterestedCourse(String username) {

        String key = INTERESTED_COURSE_KEY_PREFIX + username;

        List<Object> values = redisTemplate.opsForList().range(key, 0, 9);

        if (values == null) return List.of();

        return values.stream()
                .filter(v -> v instanceof CourseDocument)
                .map(v -> (CourseDocument) v)
                .toList();
    }
}
