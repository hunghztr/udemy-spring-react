package com.jwhisper.udemy.dto.category;

import java.util.List;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class CategoryParentResponse {
    String id;
    String name;
    List<CategoryChildResponse> categories;
}
