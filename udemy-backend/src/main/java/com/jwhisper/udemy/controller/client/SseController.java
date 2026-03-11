package com.jwhisper.udemy.controller.client;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.jwhisper.udemy.service.impl.SseComponent;

@RestController
@RequestMapping("/api/v1/sse")
public class SseController {

    private final SseComponent sseComponent;
    public SseController(SseComponent sseComponent){
        this.sseComponent = sseComponent;
    }

    @GetMapping("/subscribe")
    public SseEmitter subscribe() {
        return sseComponent.subscribe();
    }
}
