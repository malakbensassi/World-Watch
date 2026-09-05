package com.worldwatch.ai.internal;

import com.worldwatch.ai.AiChatService;
import com.worldwatch.ai.ChatRequest;
import com.worldwatch.ai.ChatResponse;
import com.worldwatch.countries.CountryDataService;
import com.worldwatch.countries.CountryDto;
import com.worldwatch.weather.WeatherDto;
import com.worldwatch.weather.WeatherService;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
class AiChatServiceImpl implements AiChatService {

    private final ChatClient chatClient;
    private final CountryDataService countryDataService;
    private final WeatherService weatherService;

    AiChatServiceImpl(ChatClient.Builder chatClientBuilder,
                      CountryDataService countryDataService,
                      WeatherService weatherService) {
        this.chatClient = chatClientBuilder.build();
        this.countryDataService = countryDataService;
        this.weatherService = weatherService;
    }

    @Override
    public ChatResponse chatAboutCountry(ChatRequest request) {
        CountryDto countryInfo = countryDataService.getCountryData(request.countryCode());

        String weatherLine;
        try {
            WeatherDto weather = weatherService.getWeather(countryInfo.capital());
            weatherLine = String.format(
                    "Current weather in %s (the capital): %.1f°C, %s, wind %.0f km/h.",
                    weather.location(), weather.temperature(), weather.condition(), weather.windSpeed()
            );
        } catch (Exception e) {
            weatherLine = "Live weather data is currently unavailable.";
        }

        String systemPrompt = String.format(
                "You are the World Watch AI correspondent, a knowledgeable global assistant. " +
                        "The user is currently browsing %s. Here is verified real-time data for this specific country " +
                        "that you must treat as ground truth and never contradict: " +
                        "Population: %s, Capital: %s, Currency: %s. %s " +
                        "This weather reading is only for the capital city — if asked about a different city or region " +
                        "within %s, say clearly that your live reading is for the capital and give a general climate answer instead. " +
                        "You are not limited to %s: feel free to answer questions about any other country, general knowledge, " +
                        "travel, culture, finance, or daily life topics using your own knowledge. Be concise and helpful.",
                countryInfo.name(), countryInfo.population(), countryInfo.capital(), countryInfo.currency(), weatherLine,
                countryInfo.name(), countryInfo.name()
        );

        String response = chatClient.prompt()
                .system(systemPrompt)
                .user(request.userMessage())
                .call()
                .content();

        return new ChatResponse(response);
    }
}