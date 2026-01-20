package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.category.CategoryChildResponse;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.dto.category.CategoryRequest;
import com.jwhisper.udemy.model.Category;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {
    CategoryParentResponse toParentCategoryResponse(Category category);
    CategoryChildResponse toChildCategoryResponse(Category category);
    Category toCategory(CategoryRequest request);
}
