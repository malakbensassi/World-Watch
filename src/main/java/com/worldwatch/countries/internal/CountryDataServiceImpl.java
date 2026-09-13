package com.worldwatch.countries.internal;

import com.worldwatch.countries.CountryDataService;
import com.worldwatch.countries.CountryDetailsDto;
import com.worldwatch.countries.CountryDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
class CountryDataServiceImpl implements CountryDataService {

    private final WebClient webClient;
    private final WebClient v5Client;

    @Value("${restcountries.api.key}")
    private String restCountriesApiKey;

    CountryDataServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://countries.dev")
                .build();
        this.v5Client = webClientBuilder
                .baseUrl("https://api.restcountries.com")
                .build();
    }

    @Override
    public CountryDto getCountryData(String countryCode) {
        // Logique existante inchangée — utilisée par le chatbot IA (context stuffing)
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

    @Override
    public CountryDetailsDto getCountryDetails(String countryCode) {
        RestCountryV5ResponseDto response = v5Client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/countries/v5/codes.alpha_2/{code}")
                        .queryParam("response_fields",
                                "names.common,capitals,currencies,languages,population,region,subregion,"
                                        + "borders,timezones,area.kilometers,classification.un_member,"
                                        + "flag.url_svg,flag.url_png,links.google_maps,government_type")
                        .build(countryCode))
                .header("Authorization", "Bearer " + restCountriesApiKey)
                .retrieve()
                .bodyToMono(RestCountryV5ResponseDto.class)
                .block();

        if (response == null || response.data() == null
                || response.data().objects() == null || response.data().objects().isEmpty()) {
            throw new RuntimeException("Country not found: " + countryCode);
        }

        var country = response.data().objects().get(0);

        String name = country.names() != null ? country.names().common() : "Unknown";

        String capital = "N/A";
        if (country.capitals() != null && !country.capitals().isEmpty()) {
            capital = country.capitals().get(0).name();
        }

        String currency = "N/A";
        String currencyCode = "USD";
        String currencySymbol = "$";
        if (country.currencies() != null && !country.currencies().isEmpty()) {
            var c = country.currencies().get(0);
            currency = c.name() + " (" + c.code() + ")";
            currencyCode = c.code();
            currencySymbol = c.symbol() != null ? c.symbol() : "";
        }

        List<String> languages = country.languages() != null
                ? country.languages().stream().map(RestCountryV5ResponseDto.CountryObject.Language::name).toList()
                : List.of();

        List<String> borders = country.borders() != null ? country.borders() : List.of();
        List<String> timezones = country.timezones() != null ? country.timezones() : List.of();

        Double landAreaKm2 = country.area() != null ? country.area().kilometers() : null;
        boolean unMember = country.classification() != null && Boolean.TRUE.equals(country.classification().un_member());
        String flagSvg = country.flag() != null ? country.flag().url_svg() : null;
        String flagPng = country.flag() != null ? country.flag().url_png() : null;
        String mapsUrl = country.links() != null ? country.links().google_maps() : null;

        long population = country.population() != null ? country.population() : 0;

        return new CountryDetailsDto(
                countryCode.toUpperCase(),
                name,
                capital,
                currency,
                currencyCode,
                currencySymbol,
                population,
                landAreaKm2,
                flagSvg,
                flagPng,
                mapsUrl,
                timezones,
                unMember,
                languages,
                borders,
                country.region(),
                country.subregion(),
                country.government_type()
        );
    }
}