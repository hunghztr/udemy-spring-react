package com.jwhisper.udemy.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.category.CategoryRequest;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.projection.category.CategoryProjection;
import com.jwhisper.udemy.service.CategoryService;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



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
    @RequestParam(name = "keyword", defaultValue = "") String keyword) throws ErrorException {
        Pagination<CategoryProjection> pagination =
         this.categoryService.getAll(pageable, isActive, keyword);
        return ResponseEntity.ok().body(pagination);
    }
    @GetMapping("/no-page")
    @ApiMessage("Lấy danh sách danh mục thành công")
    public ResponseEntity<?> getAllNoPage() throws ErrorException {
        return ResponseEntity.ok().body(this.categoryService.getAllNoPage());
    }
    
    @PostMapping()
    @ApiMessage("Tạo mới danh mục thành công")
    public ResponseEntity<?> create(@RequestBody CategoryRequest entity) throws ErrorException {
        boolean isCreated = this.categoryService.create(entity);
        return ResponseEntity.ok().body(isCreated);
    }
    @PutMapping("/{id}")
    @ApiMessage("Cập nhật danh mục thành công")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody CategoryRequest request) throws ErrorException {
        request.setId(id);
        boolean isUpdated = this.categoryService.update(request);
        return ResponseEntity.ok().body(isUpdated);
    }
    @GetMapping("/{id}")
    @ApiMessage("Lấy chi tiết danh mục thành công")
    public ResponseEntity<?> get(@PathVariable("id") String id) throws ErrorException {
        CategoryProjection categoryProjection = this.categoryService.get(id);
        return ResponseEntity.ok(categoryProjection);
    }
    @PostMapping("/delete/{id}")
    @ApiMessage("Xoá danh mục thành công")
    public ResponseEntity<?> delete(@PathVariable("id") String id) throws ErrorException {
        boolean isDeleted = this.categoryService.delete(id);
        return ResponseEntity.ok(isDeleted);
    }
    
    @PostMapping("/active/{id}")
    @ApiMessage("Kích hoạt danh mục thành công")
    public ResponseEntity<?> activate(@PathVariable("id") String id) throws ErrorException {
        boolean isActivated = this.categoryService.activate(id);
        return ResponseEntity.ok().body(isActivated);
    }
    
    
}
