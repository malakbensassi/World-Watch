package com.worldwatch.weather;

public record WeatherDto(
        String location,
        double temperature,
        double windSpeed,
        String condition,
        String time
) {}