package com.worldwatch.news.internal;

import com.worldwatch.news.ArticleDto;
import com.worldwatch.news.NewsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
class NewsServiceImpl implements NewsService {

    private final WebClient webClient;

    @Value("${news.api.key}")
    private String apiKey;

    NewsServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://newsapi.org")
                .build();
    }

    @Override
    public List<ArticleDto> getRecentNews(String countryQuery) {
        NewsApiResponseDto response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/everything")
                        .queryParam("qInTitle", countryQuery)
                        .queryParam("sortBy", "relevancy")
                        .queryParam("language", "en")
                        .queryParam("pageSize", 10)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(NewsApiResponseDto.class)
                .block();

        if (response == null || response.articles() == null) {
            return List.of();
        }

        return response.articles().stream()
                .map(a -> new ArticleDto(
                        a.title(),
                        a.description(),
                        a.url(),
                        a.source() != null ? a.source().name() : "Unknown",
                        a.publishedAt()
                ))
                .toList();
    }

    private static final List<String> FINANCE_KEYWORDS = List.of(
            "economic growth", "economic outlook", "economic policy",
            "central bank", "world bank", "monetary policy", "fiscal policy",
            "stock market", "financial market", "housing market",
            "trade deal", "trade agreement", "trade deficit",
            "foreign investment", "foreign direct investment",
            "exchange rate", "inflation rate", "gdp growth",
            "sovereign debt", "credit rating", "national budget",
            "export growth", "import tariff"
    );

    @Override
    public List<ArticleDto> getFinanceNews(String countryQuery) {
        NewsApiResponseDto response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/everything")
                        .queryParam("qInTitle", countryQuery)
                        .queryParam("sortBy", "publishedAt")
                        .queryParam("language", "en")
                        .queryParam("pageSize", 50) // on récupère large, puis on filtre nous-mêmes
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(NewsApiResponseDto.class)
                .block();

        if (response == null || response.articles() == null) {
            return List.of();
        }

        return response.articles().stream()
                .filter(a -> isFinanceRelated(a.title(), a.description()))
                .map(a -> new ArticleDto(
                        a.title(),
                        a.description(),
                        a.url(),
                        a.source() != null ? a.source().name() : "Unknown",
                        a.publishedAt()
                ))
                .limit(10)
                .toList();
    }

    private boolean isFinanceRelated(String title, String description) {
        String combined = ((title != null ? title : "") + " " + (description != null ? description : "")).toLowerCase();
        return FINANCE_KEYWORDS.stream().anyMatch(combined::contains);
    }
}