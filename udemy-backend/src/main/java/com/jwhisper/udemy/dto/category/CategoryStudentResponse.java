package com.jwhisper.udemy.dto.category;

import lombok.Data;

@Data
public class CategoryStudentResponse {
    private String id;
    private String name;
    private int students;
    private int month;
}
