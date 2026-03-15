package com.jwhisper.udemy.controller.admin;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.user.WalletResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.UserService;

@RestController
@RequestMapping("/api/v1/admin/wallets")
public class WalletController {
    private final UserService userService;
    public WalletController(UserService userService){
        this.userService = userService;
    }
    @GetMapping()
    @ApiMessage("Lấy danh sách ví thành công")
    public ResponseEntity<?> getAll(@PageableDefault(
        page = 0, size = 10,sort = "createdAt",direction = Sort.Direction.ASC
    ) Pageable pageable) {
        Pagination<WalletResponse> pagignation = this.userService.getAllWallet(pageable);
        return ResponseEntity.ok().body(pagignation);
    }
    @GetMapping("/{userId}")
    @ApiMessage("Lấy ví của người dùng thành công")
    public ResponseEntity<?> getWallet(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(this.userService.getWallet(userId));
    }
    
}
