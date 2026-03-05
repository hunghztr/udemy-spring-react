package com.jwhisper.udemy.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.elasticsearch.document.CourseDocument;

@Repository
public interface ESCourseRepository
        extends ElasticsearchRepository<CourseDocument, String> {
}

