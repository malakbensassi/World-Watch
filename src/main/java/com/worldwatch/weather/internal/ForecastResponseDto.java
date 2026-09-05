package com.worldwatch.weather.internal;

record ForecastResponseDto(Current current) {
    record Current(String time, double temperature_2m, int weather_code, double wind_speed_10m) {}
}