package com.worldwatch.conflicts.internal;

import com.worldwatch.conflicts.ConflictDto;
import com.worldwatch.conflicts.ConflictService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/conflicts")
class ConflictController {

    private final ConflictService conflictService;

    ConflictController(ConflictService conflictService) {
        this.conflictService = conflictService;
    }

    @GetMapping("/{code}")
    ConflictDto getConflictProfile(@PathVariable String code) {
        return conflictService.getCountryConflictProfile(code);
    }
}
