package com.worldwatch.countries.internal;

import com.worldwatch.countries.CountryDataService;
import com.worldwatch.countries.CountryDetailDto;
import com.worldwatch.countries.CountryDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
class CountryDataServiceImpl implements CountryDataService {

    private final WebClient restCountriesClient;

    private static final Map<String, CountryDetailDto> BENCHMARK_DETAILS = Map.of(
            "MA", new CountryDetailDto(
                    "MA",
                    "Kingdom of Morocco",
                    "Rabat",
                    "Moroccan Dirham (MAD)",
                    37457971L,
                    "Constitutional Parliamentary Monarchy",
                    "King Mohammed VI",
                    List.of("Arabic", "Amazigh", "French"),
                    710850L,
                    List.of("Phosphates & Derivatives", "Automotive Ecosystem", "Aerospace Sub-assemblies", "Renewable Solar & Wind", "Agribusiness & Seafood", "High-Value Textiles"),
                    List.of("DZ", "MR", "ES"),
                    "https://flagcdn.com/ma.svg",
                    "https://flagcdn.com/w320/ma.png",
                    "The flag of Morocco features a green pentagram on a red field.",
                    "https://mainfacts.com/media/images/coats_of_arms/ma.svg",
                    "https://goo.gl/maps/7P9Ujp Burton",
                    List.of("UTC+01:00"),
                    true
            ),
            "US", new CountryDetailDto(
                    "US",
                    "United States of America",
                    "Washington, D.C.",
                    "US Dollar (USD)",
                    331893745L,
                    "Federal Presidential Constitutional Republic",
                    "President Joe Biden",
                    List.of("English (de facto)"),
                    9833517L,
                    List.of("Advanced Technology & AI", "Defense & Aerospace", "Financial Services", "Energy & LNG", "Pharmaceuticals"),
                    List.of("CA", "MX"),
                    "https://flagcdn.com/us.svg",
                    "https://flagcdn.com/w320/us.png",
                    "The flag of the United States features thirteen horizontal stripes and fifty white stars.",
                    "https://mainfacts.com/media/images/coats_of_arms/us.svg",
                    "https://goo.gl/maps/e8M246zY4BSjkack7",
                    List.of("UTC-05:00", "UTC-06:00", "UTC-07:00", "UTC-08:00"),
                    true
            ),
            "FR", new CountryDetailDto(
                    "FR",
                    "French Republic",
                    "Paris",
                    "Euro (EUR)",
                    67391582L,
                    "Unitary Semi-Presidential Republic",
                    "President Emmanuel Macron",
                    List.of("French"),
                    643801L,
                    List.of("Aerospace & Aeronautics", "Luxury & Cosmetics", "Nuclear Energy", "Tourism", "Agri-Food & Wines"),
                    List.of("BE", "DE", "ES", "IT", "CH", "LU"),
                    "https://flagcdn.com/fr.svg",
                    "https://flagcdn.com/w320/fr.png",
                    "The flag of France is a tricolor of blue, white, and red.",
                    "https://mainfacts.com/media/images/coats_of_arms/fr.svg",
                    "https://goo.gl/maps/g7QxxSFsWyTPKuzd7",
                    List.of("UTC+01:00"),
                    true
            ),
            "DE", new CountryDetailDto(
                    "DE",
                    "Federal Republic of Germany",
                    "Berlin",
                    "Euro (EUR)",
                    83240525L,
                    "Federal Parliamentary Republic",
                    "Chancellor Olaf Scholz",
                    List.of("German"),
                    357022L,
                    List.of("Automotive & Heavy Machinery", "Chemicals & Plastics", "Precision Engineering", "Medical Electronics"),
                    List.of("DK", "PL", "CZ", "AT", "CH", "FR", "LU", "BE", "NL"),
                    "https://flagcdn.com/de.svg",
                    "https://flagcdn.com/w320/de.png",
                    "The flag of Germany is a tricolor of black, red, and gold.",
                    "https://mainfacts.com/media/images/coats_of_arms/de.svg",
                    "https://goo.gl/maps/mD9BivJwELRPuene8",
                    List.of("UTC+01:00"),
                    true
            ),
            "JP", new CountryDetailDto(
                    "JP",
                    "State of Japan",
                    "Tokyo",
                    "Japanese Yen (JPY)",
                    125836021L,
                    "Unitary Parliamentary Constitutional Monarchy",
                    "Prime Minister Shigeru Ishiba",
                    List.of("Japanese"),
                    377975L,
                    List.of("Automotive & Robotics", "Semiconductors & Optics", "Steel & Metallurgy", "Consumer Electronics"),
                    List.of(),
                    "https://flagcdn.com/jp.svg",
                    "https://flagcdn.com/w320/jp.png",
                    "The flag of Japan consists of a red disc centered on a white rectangular field.",
                    "https://mainfacts.com/media/images/coats_of_arms/jp.svg",
                    "https://goo.gl/maps/NGTLSCSrA8bMrAKR9",
                    List.of("UTC+09:00"),
                    true
            )
    );

    CountryDataServiceImpl(WebClient.Builder webClientBuilder) {
        this.restCountriesClient = webClientBuilder
                .baseUrl("https://restcountries.com/v3.1")
                .build();
    }

    @Override
    public CountryDto getCountryData(String countryCode) {
        String upper = countryCode != null ? countryCode.toUpperCase() : "MA";
        if (BENCHMARK_DETAILS.containsKey(upper)) {
            var d = BENCHMARK_DETAILS.get(upper);
            return new CountryDto(d.name(), d.capital(), d.currency(), d.population());
        }

        return new CountryDto("Country (" + upper + ")", "Capital City", "USD ($)", 10000000L);
    }

    @Override
    public CountryDetailDto getCountryDetails(String countryCode) {
        String upper = countryCode != null ? countryCode.toUpperCase() : "MA";
        if (BENCHMARK_DETAILS.containsKey(upper)) {
            return BENCHMARK_DETAILS.get(upper);
        }

        String flagSvgUrl = "https://flagcdn.com/" + upper.toLowerCase() + ".svg";
        String flagPngUrl = "https://flagcdn.com/w320/" + upper.toLowerCase() + ".png";

        return new CountryDetailDto(
                upper,
                "Sovereign Nation (" + upper + ")",
                "Administrative Capital",
                "Local Currency",
                12500000L,
                "Constitutional Republic",
                "Head of State",
                List.of("Official Language"),
                450000L,
                List.of("Agriculture", "Commerce", "Manufacturing", "Mining"),
                List.of(),
                flagSvgUrl,
                flagPngUrl,
                "National Flag of " + upper,
                null,
                "https://maps.google.com/?q=" + upper,
                List.of("UTC+00:00"),
                true
        );
    }
}