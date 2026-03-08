package com.jwhisper.udemy.service.impl;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.repository.LearningRepository;
import com.jwhisper.udemy.service.LearningService;

@Service
public class LearningServiceImpl implements LearningService {
    private final LearningRepository learningRepository;
    public LearningServiceImpl(LearningRepository learningRepository){
        this.learningRepository = learningRepository;
    }
}
