package com.worldwatch.countries.internal;

import java.util.List;

record RestCountryV5ResponseDto(DataWrapper data) {

    record DataWrapper(List<CountryObject> objects) {}

    record CountryObject(
            Names names,
            List<Capital> capitals,
            Flag flag,
            String region,
            String subregion,
            Area area,
            List<String> borders,
            Classification classification,
            List<Currency> currencies,
            String government_type,
            List<Language> languages,
            Links links,
            Long population,
            List<String> timezones
    ) {
        record Names(String common) {}
        record Capital(String name) {}
        record Flag(String url_png, String url_svg) {}
        record Area(Double kilometers) {}
        record Classification(Boolean un_member) {}
        record Currency(String code, String name, String symbol) {}
        record Language(String name, String native_name) {}
        record Links(String google_maps) {}
    }
}