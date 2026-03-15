package com.jwhisper.udemy.ai;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.Quizz;
import com.jwhisper.udemy.model.Section;
import com.jwhisper.udemy.repository.QuizzRepository;
import com.jwhisper.udemy.repository.SectionRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class QuizzService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    private final SectionRepository sectionRepository;
    private final QuizzRepository quizzRepository;

    public QuizzService(ChatClient.Builder builder, ObjectMapper objectMapper,
        SectionRepository sectionRepository, QuizzRepository quizzRepository
    ) {
        this.chatClient = builder.build();
        this.objectMapper = objectMapper;
        this.sectionRepository = sectionRepository;
        this.quizzRepository = quizzRepository;
    }

    @Async
    @Transactional
    public void generateQuiz(String id) {
        Section section = this.sectionRepository.findById(id)
        .orElseThrow(() -> new ErrorException("Chương học không tồn tại"));
        if(section.getLectures().size() < 2) return;
        List<String> titles = section.getLectures().stream()
        .map(l -> l.getName()).toList();
        String lectureContent = titles.stream()
        .map(t -> "- " + t)
        .collect(Collectors.joining("\n"));
        String prompt = """
        Tạo 10 câu hỏi trắc nghiệm từ danh sách bài giảng sau.

        Danh sách bài giảng:
        %s

        Yêu cầu:
        - Tiếng Việt
        - Mỗi câu có 4 đáp án: A,B,C,D
        - Chỉ 1 đáp án đúng
        - Câu hỏi dựa trên nội dung bài giảng
        - Câu hỏi đa dạng (khái niệm, code, lỗi thường gặp, kết quả code)

        Trả về JSON đúng format:

        [
        {
        "question": "...",
        "options": ["A. ...","B. ...","C. ...","D. ..."],
        "answer": "A"
        }
        ]

        Chỉ trả JSON. Không giải thích.
        """.formatted(lectureContent);

        String result = chatClient.prompt()
                .user(prompt)
                .call()
                .content();
        String cleanJson = extractJson(result);

        try {
            List<Quizz> quizzs = objectMapper.readValue(
                    cleanJson,
                    new TypeReference<List<Quizz>>() {}
            );
            quizzs.forEach(q -> q.setSection(section));
            this.quizzRepository.saveAll(quizzs);
            log.info("đã lưu quizz vào db");
        } catch (Exception e) {
            throw new RuntimeException("Cannot parse AI response: " + cleanJson, e);
        }
    }

    /**
     * Extract JSON array from AI response
     */
    private String extractJson(String text) {

        if (text == null) {
            throw new RuntimeException("AI response is null");
        }

        text = text.replace("```json", "")
                   .replace("```", "")
                   .trim();

        int start = text.indexOf("[");
        int end = text.lastIndexOf("]");

        if (start == -1 || end == -1) {
            throw new RuntimeException("AI did not return JSON array: " + text);
        }

        return text.substring(start, end + 1);
    }
}