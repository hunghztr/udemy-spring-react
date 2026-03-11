package com.jwhisper.udemy.dto.rating;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingRequest {
    @NotNull
    private String message;
    @NotNull
    private Double star;
}