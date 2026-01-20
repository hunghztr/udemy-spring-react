package com.jwhisper.udemy.dto.category;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class CategoryRequest {
    String id;
    String name;
    CategoryRequest categoryParent;
}
