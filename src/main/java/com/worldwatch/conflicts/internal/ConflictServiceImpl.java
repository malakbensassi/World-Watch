package com.worldwatch.conflicts.internal;

import com.worldwatch.conflicts.ConflictDto;
import com.worldwatch.conflicts.ConflictService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
class ConflictServiceImpl implements ConflictService {

    private static final Map<String, ConflictDto> CONFLICT_DATABASE = Map.of(
            "MA", new ConflictDto(
                    "MA",
                    "MODERATE",
                    List.of("Western Sahara sovereignty disputes", "Algerian border closure tensions"),
                    List.of("None active against Morocco"),
                    List.of("Agricultural export tariff quotas with EU partners"),
                    List.of("Major Non-NATO Ally (MNNA)", "Arab League", "African Union (AU)"),
                    "Strategic pivot towards Atlantic maritime development and deep African bilateral security agreements maintain stable domestic resilience."
            ),
            "US", new ConflictDto(
                    "US",
                    "ELEVATED",
                    List.of("Taiwan Strait strategic deterrence", "Indo-Pacific maritime navigation access"),
                    List.of("Broad unilateral sanction regimes applied against Russia, Iran, DPRK"),
                    List.of("Tech hardware export controls, tariff renegotiations with Asian trade partners"),
                    List.of("NATO (Founding Member)", "AUKUS", "QUAD", "Five Eyes"),
                    "Extensive global military footprint and diplomatic engagements balance systemic multi-polar competition."
            ),
            "FR", new ConflictDto(
                    "FR",
                    "MODERATE",
                    List.of("Sahel regional posture realignment", "Eastern European NATO deterrence"),
                    List.of("Participant in EU multilateral sanction frameworks"),
                    List.of("EU-Mercosur trade treaty objections"),
                    List.of("NATO", "European Union (EU)", "UN Security Council Permanent Member"),
                    "Active advocacy for European strategic autonomy alongside unified NATO defense posture."
            ),
            "DE", new ConflictDto(
                    "DE",
                    "LOW",
                    List.of("Baltic sea undersea infrastructure protection"),
                    List.of("Enforcer of EU sanctions against state aggressors"),
                    List.of("Automotive import tariffs in global markets"),
                    List.of("NATO", "European Union", "G7"),
                    "High domestic institutional stability; active fiscal reallocation toward national defense modernization."
            ),
            "JP", new ConflictDto(
                    "JP",
                    "MODERATE",
                    List.of("Senkaku Islands territorial monitoring", "Northern Territories dispute with Russia"),
                    List.of("Coordinated sanctions against regional non-proliferation violators"),
                    List.of("Agricultural and seafood import restrictions in regional markets"),
                    List.of("US-Japan Mutual Defense Treaty", "QUAD"),
                    "Rapid modernization of defensive capabilities and maritime patrol partnerships across the Pacific."
            )
    );

    @Override
    public ConflictDto getCountryConflictProfile(String countryCode) {
        if (countryCode == null) {
            countryCode = "MA";
        }
        String upper = countryCode.toUpperCase();

        if (CONFLICT_DATABASE.containsKey(upper)) {
            return CONFLICT_DATABASE.get(upper);
        }

        return new ConflictDto(
                upper,
                "LOW",
                List.of("No major active territorial disputes reported"),
                List.of("No active unilateral or multilateral sanctions"),
                List.of("Standard WTO bilateral trade framework"),
                List.of("United Nations", "Regional Economic Community"),
                "National sovereignty operates under standard regional cooperation accords with low immediate security threat levels."
        );
    }
}
