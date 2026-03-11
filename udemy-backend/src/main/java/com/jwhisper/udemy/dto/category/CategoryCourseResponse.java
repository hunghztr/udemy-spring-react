package com.jwhisper.udemy.dto.category;

import lombok.Data;

@Data
public class CategoryCourseResponse {
    private String id;
    private String name;
    private long courseCount;
}
