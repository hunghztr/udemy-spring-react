package com.jwhisper.udemy.dto.course;

import java.util.List;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class CourseRequest {
    String id;
    String name;
    List<String> categoriesId;
    String description;
    String requirement;
    double price;
    String imagePath;
    List<SectionRequest> sections;
    List<String> deletedSectionIds;
}
