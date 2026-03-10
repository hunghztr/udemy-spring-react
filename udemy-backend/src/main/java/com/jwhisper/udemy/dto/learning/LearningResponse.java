package com.jwhisper.udemy.dto.learning;

import lombok.Data;

@Data
public class LearningResponse {
    private String id;
    private String imagePath;
    private String name;
    private Integer progress;
    private Double star;
}
