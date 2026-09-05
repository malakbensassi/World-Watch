package com.worldwatch.weather.internal;

import com.worldwatch.weather.WeatherDto;
import com.worldwatch.weather.WeatherService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
class WeatherServiceImpl implements WeatherService {

    private final WebClient geocodingClient;
    private final WebClient forecastClient;

    // Mapping simplifié des codes météo WMO utilisés par Open-Meteo
    private static final Map<Integer, String> CONDITIONS = Map.ofEntries(
            Map.entry(0, "Clear sky"),
            Map.entry(1, "Mainly clear"),
            Map.entry(2, "Partly cloudy"),
            Map.entry(3, "Overcast"),
            Map.entry(45, "Fog"),
            Map.entry(51, "Light drizzle"),
            Map.entry(61, "Slight rain"),
            Map.entry(63, "Moderate rain"),
            Map.entry(65, "Heavy rain"),
            Map.entry(71, "Slight snow"),
            Map.entry(80, "Rain showers"),
            Map.entry(95, "Thunderstorm")
    );

    WeatherServiceImpl(WebClient.Builder webClientBuilder) {
        this.geocodingClient = webClientBuilder.baseUrl("https://geocoding-api.open-meteo.com").build();
        this.forecastClient = webClientBuilder.baseUrl("https://api.open-meteo.com").build();
    }

    @Override
    public WeatherDto getWeather(String cityName) {
        GeocodingResponseDto geo = geocodingClient.get()
                .uri(uriBuilder -> uriBuilder.path("/v1/search").queryParam("name", cityName).queryParam("count", 1).build())
                .retrieve()
                .bodyToMono(GeocodingResponseDto.class)
                .block();

        if (geo == null || geo.results() == null || geo.results().isEmpty()) {
            throw new RuntimeException("Location not found: " + cityName);
        }

        var location = geo.results().get(0);

        ForecastResponseDto forecast = forecastClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/forecast")
                        .queryParam("latitude", location.latitude())
                        .queryParam("longitude", location.longitude())
                        .queryParam("current", "temperature_2m,weather_code,wind_speed_10m")
                        .queryParam("timezone", "auto")
                        .build())
                .retrieve()
                .bodyToMono(ForecastResponseDto.class)
                .block();

        if (forecast == null || forecast.current() == null) {
            throw new RuntimeException("Weather data unavailable for " + cityName);
        }

        String condition = CONDITIONS.getOrDefault(forecast.current().weather_code(), "Unknown");

        return new WeatherDto(
                location.name(),
                forecast.current().temperature_2m(),
                forecast.current().wind_speed_10m(),
                condition,
                forecast.current().time()
        );
    }
}