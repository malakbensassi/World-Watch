package com.worldwatch.news.internal;

import java.util.List;

record NewsApiResponseDto(
        String status,
        int totalResults,
        List<ArticleRaw> articles
) {
    record ArticleRaw(
            String title,
            String description,
            String url,
            String publishedAt,
            SourceRaw source
    ) {}

    record SourceRaw(String id, String name) {}
}