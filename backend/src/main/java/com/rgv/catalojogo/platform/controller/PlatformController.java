package com.rgv.catalojogo.platform.controller;

import com.rgv.catalojogo.platform.entity.Platform;
import com.rgv.catalojogo.platform.service.PlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/catalojogos/v1/platform")
@RequiredArgsConstructor
public class PlatformController {
    private final PlatformService platformService;


    @GetMapping()
    public ResponseEntity<List<Platform>> findAll(){
        List<Platform> platforms = platformService.findAll();
        return ResponseEntity.ok(platforms);
    }
}