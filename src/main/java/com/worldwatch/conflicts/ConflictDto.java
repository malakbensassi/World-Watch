package com.worldwatch.conflicts;

import java.util.List;

public record ConflictDto(
        String countryCode,
        String threatLevel,
        List<String> activeDisputes,
        List<String> economicSanctions,
        List<String> tradeDisputes,
        List<String> securityAlliances,
        String geopoliticalAnalysis
) {}
