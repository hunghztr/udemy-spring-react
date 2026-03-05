package com.jwhisper.udemy.redis;

import java.util.List;

import com.jwhisper.udemy.elasticsearch.document.CourseDocument;

public interface InterestedRedisService {
    void setInterestedCourse(String username, List<CourseDocument> elements);
    List<CourseDocument> getInterestedCourse(String username);
}
