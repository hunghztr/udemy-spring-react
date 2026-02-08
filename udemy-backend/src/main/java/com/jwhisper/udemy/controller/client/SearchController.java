package com.jwhisper.udemy.controller.client;

import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.HistoryRedisService;
import com.jwhisper.udemy.service.SearchService;

@RestController
@RequestMapping("/api/v1/client")
public class SearchController {
    private final SecurityHelper securityHelper;
    private final HistoryRedisService historyRedisService;
    private final SearchService searchService;
    public SearchController(SecurityHelper securityHelper,
        HistoryRedisService historyRedisService,
        SearchService searchService
    ){
        this.securityHelper = securityHelper;
        this.historyRedisService = historyRedisService;
        this.searchService = searchService;
    }
    @GetMapping("/search")
    @ApiMessage("Tìm kiếm mơ hồ thành công")
    public ResponseEntity<?> search(@RequestParam(name = "keyword",defaultValue = "") String keyword,
    @PageableDefault(page = 0,size = 10) Pageable pageable) {
        String username = this.securityHelper.getCurrentUsername();
        if(!username.equals("anonymousUser"))
            this.historyRedisService.set(username, keyword);
        Pagination<CourseSearchResponse> pagination = this.searchService.searchFuzzi(pageable, keyword);
        return ResponseEntity.ok(pagination);
    }
    @GetMapping("/history")
    @ApiMessage("Hiển thị lịch sử tìm kiếm")
    public ResponseEntity<?> recommend() {
        String username = this.securityHelper.getCurrentUsername();
        Set<String> sets = null;
        if(!username.equals("anonymousUser"))
             sets = this.historyRedisService.getList(username);
        return ResponseEntity.ok(sets);
    }
    @DeleteMapping("/history/{keyword}")
    @ApiMessage("Xoá lịch sử tìm kiếm")
    public ResponseEntity<?> delete(@PathVariable("keyword") String keyword ){
        String username = this.securityHelper.getCurrentUsername();
        if(!username.equals("anonymousUser"))
            this.historyRedisService.delete(username, keyword);
        return ResponseEntity.ok(true);
    }
}
