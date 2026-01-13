package com.jwhisper.udemy.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.projection.category.CategoryProjection;
import com.jwhisper.udemy.service.CategoryService;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/v1/admin/categories")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping()
    @ApiMessage("Lấy danh sách danh mục thành công")
    public ResponseEntity<?> getAll(@PageableDefault(size = 10, page = 0,sort = "createdAt",
        direction = Sort.Direction.ASC
    ) Pageable pageable,@RequestParam("active") boolean isActive,
    @RequestParam(name = "keyword", defaultValue = "") String keyword) {
        Pagination<CategoryProjection> pagination =
         this.categoryService.getAll(pageable, isActive, keyword);
        return ResponseEntity.ok().body(pagination);
    }
    
}
