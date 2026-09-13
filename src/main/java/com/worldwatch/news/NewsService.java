package com.worldwatch.news;

import java.util.List;

public interface NewsService {
    List<ArticleDto> getRecentNews(String countryQuery);
    List<ArticleDto> getFinanceNews(String countryQuery);
}