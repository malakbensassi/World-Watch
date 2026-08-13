package com.worldwatch.ai.internal;

import com.worldwatch.ai.AiChatService;
import com.worldwatch.ai.ChatRequest;
import com.worldwatch.ai.ChatResponse;
// We import the public interface from the countries module!
import com.worldwatch.countries.CountryDataService;
import com.worldwatch.countries.CountryDto;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
class AiChatServiceImpl implements AiChatService { // Notice: No 'public' keyword

    private final ChatClient chatClient;
    private final CountryDataService countryDataService; // Inter-module communication

    AiChatServiceImpl(ChatClient.Builder chatClientBuilder, CountryDataService countryDataService) {
        this.chatClient = chatClientBuilder.build();
        this.countryDataService = countryDataService;
    }

    @Override
    public ChatResponse chatAboutCountry(ChatRequest request) {
        // 1. Fetch real-time data from the 'countries' module
        CountryDto countryInfo = countryDataService.getCountryData(request.countryCode());

        // 2. Build the system prompt (Context Stuffing)
        String systemPrompt = String.format(
                "You are the World Watch AI assistant. The user is asking about %s. " +
                        "Here is the latest real-time data: Population: %s, Capital: %s, Currency: %s. " +
                        "Answer concisely and accurately based ONLY on this data.",
                countryInfo.name(),
                countryInfo.population(),
                countryInfo.capital(),
                countryInfo.currency()
        );

        // 3. Call the LLM using Spring AI's ChatClient
        String response = chatClient.prompt()
                .system(systemPrompt)
                .user(request.userMessage())
                .call()
                .content();

        return new ChatResponse(response);
    }
}