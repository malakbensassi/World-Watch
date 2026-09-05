package com.worldwatch.ai;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
        @NotBlank(message = "countryCode is required") String countryCode,
        @NotBlank(message = "userMessage is required") String userMessage
) {}