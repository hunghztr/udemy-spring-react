package com.jwhisper.udemy.service.impl;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.jwhisper.udemy.dto.notification.NotificationResponse;
import com.jwhisper.udemy.security.SecurityHelper;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SseComponent  {

    private final Map<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();
    private final SecurityHelper securityHelper;
    public SseComponent(SecurityHelper securityHelper){
        this.securityHelper= securityHelper;
    }
    public SseEmitter subscribe() {
        String username = this.securityHelper.getCurrentUsername();
        SseEmitter emitter = new SseEmitter(0L);
        emitters
        .computeIfAbsent(username, k -> new CopyOnWriteArrayList<>())
        .add(emitter);

        emitter.onCompletion(() -> this.remove(username,emitter));
        emitter.onTimeout(() -> this.remove(username,emitter));
        emitter.onError(e -> this.remove(username,emitter));

        return emitter;
    }

    public void send(String username,NotificationResponse notification) {
        List<SseEmitter> list = emitters.get(username);
        if (list == null) return;

        for (SseEmitter emitter : list) {
            try {
                emitter.send(
                    SseEmitter.event()
                        .name("notify")
                        .data(notification)
                );
            } catch (Exception e) {
                this.remove(username, emitter);
            }
        }
    }
    public void remove(String username, SseEmitter emitter) {
    List<SseEmitter> list = emitters.get(username);

    if (list != null) {
        list.remove(emitter);

        if (list.isEmpty()) {
            emitters.remove(username);
        }
    }
}
}
