package com.worldwatch.countries;

// The public interface for Country Intelligence
public interface CountryDataService {
    CountryDto getCountryData(String countryCode);
    CountryDetailDto getCountryDetails(String countryCode);
}