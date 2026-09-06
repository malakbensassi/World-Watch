package com.worldwatch.countries;

// The public record that the AI module is expecting
public record CountryDto(
        String name,
        String capital,
        String currency,
        long population
) {}