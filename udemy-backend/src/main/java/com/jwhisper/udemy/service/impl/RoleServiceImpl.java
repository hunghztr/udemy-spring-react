package com.jwhisper.udemy.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.projection.role.RoleProject;
import com.jwhisper.udemy.repository.RoleRepository;
import com.jwhisper.udemy.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    public RoleServiceImpl(RoleRepository roleRepository){
        this.roleRepository = roleRepository;
    }
    @Override
    public Pagination<RoleProject> getAll(Pageable pageable, boolean isActive, String keyword) throws ErrorException {
        Pagination<RoleProject> pagignation = new Pagination<>();
        Pagination.Meta meta = new Pagination.Meta();
        Page<RoleProject> rolePage = this.roleRepository.findAllByIsActiveAndNameContaining(isActive, keyword, pageable);
        if(rolePage.getContent() == null || rolePage.getContent().size() == 0){
            throw new ErrorException("Danh sách vai trò rỗng");
        }
        pagignation.setElements(rolePage.getContent());
        meta.setCurrentPage(rolePage.getNumber());
        meta.setPageSize(rolePage.getSize());
        meta.setElementTotals(rolePage.getTotalElements());
        meta.setPageTotals(rolePage.getTotalPages());
        pagignation.setMeta(meta);
        return pagignation;
    }
    
}
