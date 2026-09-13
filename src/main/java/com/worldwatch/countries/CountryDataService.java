package com.worldwatch.countries;

public interface CountryDataService {
    CountryDto getCountryData(String countryCode);
    CountryDetailsDto getCountryDetails(String countryCode);
}