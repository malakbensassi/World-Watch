package com.worldwatch.ai;

// The public contract. Other modules can call this, but they don't know HOW it works.
public interface AiChatService {
    ChatResponse chatAboutCountry(ChatRequest request);
}