package com.worldwatch.countries.internal;

import com.worldwatch.countries.CountryDataService;
import com.worldwatch.countries.CountryDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
class CountryDataServiceImpl implements CountryDataService {

    private final WebClient webClient;

    CountryDataServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://countries.dev")
                .build();
    }

    @Override
    public CountryDto getCountryData(String countryCode) {
        RestCountryDto externalData = webClient.get()
                .uri("/alpha/{code}", countryCode)
                .retrieve()
                .bodyToMono(RestCountryDto.class)
                .block();

        if (externalData == null) {
            throw new RuntimeException("Country not found: " + countryCode);
        }

        String countryName = externalData.name() != null ? externalData.name() : "Unknown";
        String capital = externalData.capital() != null ? externalData.capital() : "N/A";

        String currency = "N/A";
        if (externalData.currencies() != null && !externalData.currencies().isEmpty()) {
            var firstCurrency = externalData.currencies().get(0);
            currency = firstCurrency.name() + " (" + firstCurrency.code() + ")";
        }

        long population = externalData.population() != null ? externalData.population() : 0;

        return new CountryDto(countryName, capital, currency, population);
    }
}