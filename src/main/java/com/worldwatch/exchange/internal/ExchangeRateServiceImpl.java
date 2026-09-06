package com.worldwatch.exchange.internal;

import com.worldwatch.exchange.ExchangeRateDto;
import com.worldwatch.exchange.ExchangeRateService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
class ExchangeRateServiceImpl implements ExchangeRateService {

    private final WebClient webClient;

    @Value("${exchangerate.api.key}")
    private String apiKey;

    ExchangeRateServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://v6.exchangerate-api.com")
                .build();
    }

    @Override
    public ExchangeRateDto getExchangeRate(String targetCurrency, String baseCurrency) {
        ExchangeRateApiResponseDto response = webClient.get()
                .uri("/v6/{apiKey}/latest/{base}", apiKey, baseCurrency)
                .retrieve()
                .bodyToMono(ExchangeRateApiResponseDto.class)
                .block();

        if (response == null || response.conversion_rates() == null
                || !response.conversion_rates().containsKey(targetCurrency)) {
            throw new IllegalStateException("Exchange rate not available for " + targetCurrency);
        }

        double rate = response.conversion_rates().get(targetCurrency);

        return new ExchangeRateDto(baseCurrency, targetCurrency, rate, "latest");
    }
}