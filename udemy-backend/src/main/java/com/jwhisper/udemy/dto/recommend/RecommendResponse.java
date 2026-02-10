package com.jwhisper.udemy.dto.recommend;

import com.jwhisper.udemy.helper.constant.RecommendType;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecommendResponse {
    String keyword;
    RecommendType type;
}
