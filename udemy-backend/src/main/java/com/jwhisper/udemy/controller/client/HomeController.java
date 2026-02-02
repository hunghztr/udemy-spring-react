package com.jwhisper.udemy.controller.client;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryParentResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.CategoryService;

@RestController
@RequestMapping("/api/v1/client")
public class HomeController {
    private final CategoryService categoryService;
    public HomeController(CategoryService categoryService){
        this.categoryService = categoryService;
    }
    
    @GetMapping("/categories/get-all-parents")
    @ApiMessage("Lấy danh sách danh mục cha thành công")
    public ResponseEntity<?> getAllParents(@PageableDefault(page = 0,size = 10,
        sort = "createdAt",direction = Sort.Direction.ASC) Pageable pageable,
        @RequestParam(name = "active",required = false) boolean isActive,
    @RequestParam(name = "keyword",required = false) String keyword)  {

        Pagination<CategoryParentResponse> parents =
         this.categoryService.getAllParents(pageable,isActive);
        return ResponseEntity.ok().body(parents);
    }
}
