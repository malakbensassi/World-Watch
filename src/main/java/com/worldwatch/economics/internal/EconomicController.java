package com.worldwatch.economics.internal;

import com.worldwatch.economics.EconomicIndicatorDto;
import com.worldwatch.economics.EconomicIndicatorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/economics")
class EconomicController {

    private final EconomicIndicatorService economicIndicatorService;

    EconomicController(EconomicIndicatorService economicIndicatorService) {
        this.economicIndicatorService = economicIndicatorService;
    }

    @GetMapping("/{code}")
    EconomicIndicatorDto getIndicators(@PathVariable String code) {
        return economicIndicatorService.getEconomicIndicators(code);
    }
}
