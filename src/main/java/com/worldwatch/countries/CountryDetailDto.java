package com.worldwatch.countries;

import java.util.List;

public record CountryDetailDto(
        String countryCode,
        String name,
        String capital,
        String currency,
        long population,
        String governmentType,
        String headOfState,
        List<String> officialLanguages,
        long landAreaKm2,
        List<String> majorIndustries,
        List<String> borderCountries,
        String flagSvg,
        String flagPng,
        String flagAlt,
        String coatOfArmsSvg,
        String mapsUrl,
        List<String> timezones,
        boolean unMember
) {}
