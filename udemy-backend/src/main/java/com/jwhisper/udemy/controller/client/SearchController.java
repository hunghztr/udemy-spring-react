package com.jwhisper.udemy.controller.client;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
import com.jwhisper.udemy.dto.course.FilterRequest;
import com.jwhisper.udemy.dto.recommend.RecommendResponse;
import com.jwhisper.udemy.elasticsearch.SearchService;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.helper.constant.RecommendType;
import com.jwhisper.udemy.redis.HistoryRedisService;
import com.jwhisper.udemy.redis.TrendingRedisService;
import com.jwhisper.udemy.security.SecurityHelper;

@RestController
@RequestMapping("/api/v1/client")
public class SearchController {
    private final SecurityHelper securityHelper;
    private final HistoryRedisService historyRedisService;
    private final TrendingRedisService trendingRedisService;
    private final SearchService searchService;
    public SearchController(SecurityHelper securityHelper,
        HistoryRedisService historyRedisService,
        SearchService searchService,TrendingRedisService trendingRedisService
    ){
        this.securityHelper = securityHelper;
        this.historyRedisService = historyRedisService;
        this.searchService = searchService;
        this.trendingRedisService = trendingRedisService;
    }
    @GetMapping("/search")
    @ApiMessage("Tìm kiếm mơ hồ thành công")
    public ResponseEntity<?> search(
            @RequestParam(name = "keyword", defaultValue = "") String keyword,
             FilterRequest filterRequest,
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        String normalized = keyword == null ? "" : keyword.trim();

        if (normalized.length() >= 2) {
            String username = securityHelper.getCurrentUsername();
            if (!"anonymousUser".equals(username)) {
                historyRedisService.set(username, normalized);
            }
            trendingRedisService.recordKeyword(normalized);
        }
        Pagination<CourseSearchResponse> pagination =
                searchService.searchFuzzi(pageable, keyword,filterRequest);
        return ResponseEntity.ok(pagination);
    }
    /**
     * lấy các đề xuất (history keyword và trending keyword)
     * @return
     */
    @GetMapping("/recommend")
    @ApiMessage("Hiển thị gợi ý tìm kiếm")
    public ResponseEntity<?> recommend() {
        final int LIMIT = 10;
        final int HISTORY_LIMIT = 5;

        String username = securityHelper.getCurrentUsername();

        List<RecommendResponse> result = new ArrayList<>();
        Set<String> seen = new HashSet<>();

        if (!"anonymousUser".equals(username)) {
            historyRedisService.getList(username).stream()
                .limit(HISTORY_LIMIT)
                .forEach(k -> {
                    result.add(new RecommendResponse(k, RecommendType.HISTORY));
                    seen.add(k);
                });
        }

        if (result.size() < LIMIT) {
            trendingRedisService.getTrendingKeywords(LIMIT).forEach(k -> {
                if (result.size() >= LIMIT) return;

                if (seen.add(k)) {
                    result.add(new RecommendResponse(k, RecommendType.TRENDING));
                }
            });
        }

        return ResponseEntity.ok(result);
    }
    /**
     * lấy gợi ý đề xuất khi người dùng gõ phím
     * @param keyword dữ liệu người dùng đang nhập
     * @return danh sách đề xuất
     */
    @GetMapping("/suggest/{keyword}")
    @ApiMessage("Lấy đề xuất thành công")
    public ResponseEntity<?> suggest(@PathVariable String keyword) {
        final int LIMIT = 10;

        if (keyword.isBlank()) {
            return ResponseEntity.ok(List.of());
        }

        Set<String> trending =
            trendingRedisService.getTrendingByKeyword(keyword, LIMIT);

        return ResponseEntity.ok(
            trending.stream()
                .map(k -> new RecommendResponse(k, RecommendType.TRENDING))
                .toList()
        );
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
