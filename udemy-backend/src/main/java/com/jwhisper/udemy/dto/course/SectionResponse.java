package com.jwhisper.udemy.dto.course;

import java.util.List;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SectionResponse {
    String id;
    String name;
    int totalLecture;
    double hour;
    List<LectureResponse> lectures;
}
