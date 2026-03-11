package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.rating.RatingRequest;
import com.jwhisper.udemy.dto.rating.RatingResponse;
import com.jwhisper.udemy.model.Rating;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RatingMapper {
    RatingResponse toRatingResponse(Rating rating);
    Rating toRating(RatingRequest request);
}
