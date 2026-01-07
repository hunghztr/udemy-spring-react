package com.jwhisper.udemy.dto;

import java.util.List;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Pagination<T> {
    List<T> elements;
    Meta meta;
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Meta  {
        int currentPage;
        int pageSize;
        long elementTotals;
        int pageTotals;
    }
}
