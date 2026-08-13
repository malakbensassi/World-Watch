package com.worldwatch.countries;

// The public interface the AI module is trying to call
public interface CountryDataService {
    CountryDto getCountryData(String countryCode);
}