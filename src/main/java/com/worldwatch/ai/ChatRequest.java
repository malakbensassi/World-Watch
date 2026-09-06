package com.worldwatch.ai;

// A public record to hold incoming requests from the frontend
public record ChatRequest(
        String countryCode,
        String userMessage
) {}