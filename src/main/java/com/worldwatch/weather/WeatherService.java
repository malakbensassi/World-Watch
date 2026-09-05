package com.worldwatch.weather;

public interface WeatherService {
    WeatherDto getWeather(String cityName);
}