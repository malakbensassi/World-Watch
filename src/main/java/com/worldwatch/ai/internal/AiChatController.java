package com.worldwatch.ai.internal;

import com.worldwatch.ai.AiChatService;
import com.worldwatch.ai.ChatRequest;
import com.worldwatch.ai.ChatResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
class AiChatController {

    private final AiChatService aiChatService;

    AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping
    ChatResponse chat(@jakarta.validation.Valid @RequestBody ChatRequest request) {
        return aiChatService.chatAboutCountry(request);
    }
}