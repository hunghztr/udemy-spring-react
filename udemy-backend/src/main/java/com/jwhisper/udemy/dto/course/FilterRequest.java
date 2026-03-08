package com.jwhisper.udemy.dto.course;

import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class FilterRequest {
    Double star;
    Boolean isFree;
    Double durationFrom;
    Double durationTo;
    String sortBy;
}
