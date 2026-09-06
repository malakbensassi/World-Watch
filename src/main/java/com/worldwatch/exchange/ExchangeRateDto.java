package com.worldwatch.exchange;

public record ExchangeRateDto(
        String baseCurrency,
        String targetCurrency,
        double rate,
        String date
) {}