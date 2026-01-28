package com.jwhisper.udemy.dto.course;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LectureResponse {
    String id;
    String name;
    double second;
    String path;
    boolean isFinish;
}
