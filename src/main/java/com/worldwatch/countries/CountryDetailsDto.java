package com.worldwatch.countries;

import java.util.List;

public record CountryDetailsDto(
        String countryCode,
        String name,
        String capital,
        String currency,        // ex: "Moroccan dirham (MAD)" — format lisible
        String currencyCode,    // ex: "MAD" — code ISO pur, à utiliser pour /api/exchange-rate
        String currencySymbol,
        long population,
        Double landAreaKm2,
        String flagSvg,
        String flagPng,
        String mapsUrl,
        List<String> timezones,
        boolean unMember,
        List<String> officialLanguages,
        List<String> borderCountries,
        String region,
        String subregion,
        String governmentType
) {}