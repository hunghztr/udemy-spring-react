package com.jwhisper.udemy.dto;

import java.util.List;

import lombok.Data;

@Data
public class SliceResponse<T> {
    private List<T> items;
    private boolean hasNext;
}
