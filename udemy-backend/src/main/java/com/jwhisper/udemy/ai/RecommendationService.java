package com.jwhisper.udemy.ai;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;
import com.jwhisper.udemy.elasticsearch.SearchService;
import com.jwhisper.udemy.model.Category;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RecommendationService {

    private final ChatClient chatClient;
    private final SearchService searchService;
    private final RedisTemplate<String,Object> redisTemplate;
    public RecommendationService(ChatClient.Builder builder, SearchService searchService,
        RedisTemplate<String,Object> redisTemplate
    ) {
        this.chatClient = builder.build();
        this.searchService = searchService;
        this.redisTemplate = redisTemplate;
    }

    @Async
    public void analyze(
            String username,
            String courseName,
            List<Category> categories,
            String learningPath
    ) {

        // convert categories -> string
        String categoryText = categories.stream()
                .map(Category::getName)
                .collect(Collectors.joining(", "));

        String prompt = """
        Bạn là AI tư vấn lộ trình học lập trình.

        Người dùng: %s

        Khoá học hiện tại:
        %s

        Categories của khoá học:
        %s

        Learning path:
        %s

        Nhiệm vụ:
        1. Xác định category hiện tại của khoá học.
        2. So sánh với learning path.
        3. Tìm category tiếp theo nên học trong learning path.

        QUY TẮC TRẢ VỀ:
        - Chỉ trả về đúng 1 tên category hợp lí nhất có trong learning path.
        - Không giải thích.
        - Không thêm chữ khác.

        Ví dụ output hợp lệ:
        Java
        """.formatted(username, courseName, categoryText, learningPath);


        String result = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        log.info("AI recommendation: {}", result);
        // TODO: sau này lưu DB
        Pagination<CourseSearchResponse> pagination = this.searchService
        .getCoursesByCategory(result.trim(), PageRequest.of(0, 10), null);
        String key = "recommend:" + username;


        for (CourseSearchResponse course : pagination.getElements()) {
            redisTemplate.opsForList().rightPush(key, course);
        }

        redisTemplate.expire(key, Duration.ofHours(6));
    }
}