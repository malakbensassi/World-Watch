package com.worldwatch.weather.internal;

import java.util.List;

record GeocodingResponseDto(List<Result> results) {
    record Result(String name, double latitude, double longitude, String country) {}
}