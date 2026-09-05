package com.worldwatch.weather.internal;

import com.worldwatch.weather.WeatherDto;
import com.worldwatch.weather.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
class WeatherController {

    private final WeatherService weatherService;

    WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    WeatherDto getWeather(@RequestParam String city) {
        return weatherService.getWeather(city);
    }
}