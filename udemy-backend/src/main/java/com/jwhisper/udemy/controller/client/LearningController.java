package com.jwhisper.udemy.controller.client;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.service.LearningService;

@RestController
@RequestMapping("/api/v1/learnings")
public class LearningController {
    private final LearningService learningService;
    public LearningController(LearningService learningService){
        this.learningService = learningService;
    }
}
