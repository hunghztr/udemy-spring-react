package com.jwhisper.udemy.ai;

import java.util.Map;
import java.util.concurrent.*;

import org.springframework.stereotype.Service;

@Service
public class QuizzDebounceService {

    private final ScheduledExecutorService scheduler =
            Executors.newScheduledThreadPool(1);

    private final Map<String, ScheduledFuture<?>> tasks =
            new ConcurrentHashMap<>();

    private final QuizzService quizzService;

    public QuizzDebounceService(QuizzService quizzService) {
        this.quizzService = quizzService;
    }

    public void schedule(String sectionId) {

        // nếu đã có task thì huỷ
        ScheduledFuture<?> oldTask = tasks.get(sectionId);
        if (oldTask != null) {
            oldTask.cancel(false);
        }

        // tạo task mới chạy sau 10s
        ScheduledFuture<?> newTask = scheduler.schedule(
                () -> quizzService.generateQuiz(sectionId),
                10,
                TimeUnit.SECONDS
        );

        tasks.put(sectionId, newTask);
    }
}