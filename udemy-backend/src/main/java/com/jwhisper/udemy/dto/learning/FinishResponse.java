package com.jwhisper.udemy.dto.learning;

import lombok.Data;

@Data
public class FinishResponse {
    private Boolean isFinish;
    private String lectureId;
}
