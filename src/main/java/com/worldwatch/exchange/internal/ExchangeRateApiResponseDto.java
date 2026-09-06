package com.worldwatch.exchange.internal;

import java.util.Map;

record ExchangeRateApiResponseDto(
        String result,
        String base_code,
        Map<String, Double> conversion_rates
) {}