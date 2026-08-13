package com.worldwatch.countries.internal;

import com.worldwatch.countries.CountryDataService;
import com.worldwatch.countries.CountryDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/countries")
class CountryController {

    private final CountryDataService countryDataService;

    CountryController(CountryDataService countryDataService) {
        this.countryDataService = countryDataService;
    }

    @GetMapping("/{code}")
    CountryDto getCountry(@PathVariable String code) {
        return countryDataService.getCountryData(code);
    }
}