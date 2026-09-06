package com.worldwatch.exchange;

public interface ExchangeRateService {
    ExchangeRateDto getExchangeRate(String targetCurrency, String baseCurrency);
}