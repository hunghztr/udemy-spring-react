package com.jwhisper.udemy.dto.course;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SectionRequest {
    String id;
    String name;
}
