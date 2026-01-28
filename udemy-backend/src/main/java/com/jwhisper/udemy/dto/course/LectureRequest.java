package com.jwhisper.udemy.dto.course;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LectureRequest {
    String id;
    String name;
    String path;
    SectionRequest section;
    double second;
}
