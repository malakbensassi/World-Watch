package com.worldwatch.news.internal;

import com.worldwatch.news.ArticleDto;
import com.worldwatch.news.NewsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
class NewsController {

    private final NewsService newsService;

    NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    List<ArticleDto> getNews(@RequestParam String country) {
        return newsService.getRecentNews(country);
    }
}