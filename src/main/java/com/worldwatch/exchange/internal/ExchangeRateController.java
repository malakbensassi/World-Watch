package com.worldwatch.exchange.internal;

import com.worldwatch.exchange.ExchangeRateDto;
import com.worldwatch.exchange.ExchangeRateService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/exchange-rate")
class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    ExchangeRateController(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }

    @GetMapping
    ExchangeRateDto getRate(@RequestParam String currency,
                            @RequestParam(defaultValue = "USD") String base) {
        return exchangeRateService.getExchangeRate(currency, base);
    }
}