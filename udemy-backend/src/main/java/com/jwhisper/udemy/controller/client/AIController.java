package com.jwhisper.udemy.controller.client;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/client")
public class AIController {
    private final ChatClient chatClient;
    
        public AIController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

        @GetMapping("/ai/test")
    public String test(
            @RequestParam(defaultValue = "Xin chào") String message
    ) {

        return chatClient
                .prompt(message)
                .call()
                .content();
    }
}
