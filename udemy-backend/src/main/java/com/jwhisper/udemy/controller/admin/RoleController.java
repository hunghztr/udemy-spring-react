package com.jwhisper.udemy.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.projection.role.RoleProject;
import com.jwhisper.udemy.service.RoleService;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


@RestController
@RequestMapping("/api/v1/admin/roles")
public class RoleController {
    private final RoleService roleService;
    public RoleController(RoleService roleService){
        this.roleService = roleService;
    }

    @GetMapping()
    @ApiMessage("Lấy danh sách vai trò thành công")
    public ResponseEntity<?> getAll(@PageableDefault(page = 0,size = 10,sort = "createdAt",
    direction = Sort.Direction.ASC) Pageable pageable,
    @RequestParam("active") boolean isActive,
    @RequestParam(name = "keyword", defaultValue = "") String keyword)  {
        Pagination<RoleProject> pagination = this.roleService.getAll(pageable,isActive,keyword);
        return ResponseEntity.ok().body(pagination);
    }
    
}
