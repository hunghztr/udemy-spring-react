package com.jwhisper.udemy.dto;

import java.util.List;

import lombok.Data;

@Data
public class TwoListRequest<T,V> {
    private List<T> firstList;
    private List<V> secondList;
}
