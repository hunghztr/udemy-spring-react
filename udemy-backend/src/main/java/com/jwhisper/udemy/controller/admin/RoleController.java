package com.jwhisper.udemy.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.projection.role.RoleProject;
import com.jwhisper.udemy.service.RoleService;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


@RestController
@RequestMapping("/api/v1")
public class RoleController {
    private final RoleService roleService;
    public RoleController(RoleService roleService){
        this.roleService = roleService;
    }

    @GetMapping("/roles")
    @ApiMessage("Lấy danh sách vai trò thành công")
    public ResponseEntity<?> getAll(@PageableDefault(page = 0,size = 10,sort = "createdAt",
    direction = Sort.Direction.ASC) Pageable pageable) throws ErrorException {
        Pagination<RoleProject> pagination = this.roleService.getAll(pageable);
        return ResponseEntity.ok().body(pagination);
    }
    
}
