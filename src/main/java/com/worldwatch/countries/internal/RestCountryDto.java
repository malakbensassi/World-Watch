package com.worldwatch.countries.internal;

import java.util.List;

record RestCountryDto(
        String name,
        String capital,
        String region,
        List<CurrencyData> currencies,
        Long population
) {
    record CurrencyData(String code, String name, String symbol) {}
}