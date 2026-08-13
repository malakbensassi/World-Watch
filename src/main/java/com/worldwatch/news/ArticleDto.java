package com.worldwatch.news;

public record ArticleDto(
        String title,
        String description,
        String url,
        String source,
        String publishedAt
) {}