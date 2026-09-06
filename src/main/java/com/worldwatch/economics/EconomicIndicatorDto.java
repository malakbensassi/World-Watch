package com.worldwatch.economics;

public record EconomicIndicatorDto(
        String countryCode,
        String gdpNominal,
        String gdpGrowthRate,
        String inflationRate,
        String unemploymentRate,
        String centralBankRate,
        String publicDebtRatio,
        String tradeBalance,
        String creditRating
) {}
