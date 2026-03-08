package com.jwhisper.udemy.dto.course;

import java.util.List;

import lombok.Data;

@Data
public class CourseSearchResponse {
    private String id;
    private String name;
    private String authorName;
    private String imagePath;
    private String description;
    private double star;
    private int sold;
    private double price;
    private double hour;

    private List<String> categories;
}
