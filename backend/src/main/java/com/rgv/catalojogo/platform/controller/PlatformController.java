package com.rgv.catalojogo.platform.controller;

import com.rgv.catalojogo.platform.entity.Platform;
import com.rgv.catalojogo.platform.service.PlatformService;
import lombok.RequiredArgsConstructor; // Use apenas este
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/catalojogos/v1/platform")
@RequiredArgsConstructor // Isso irá gerar o construtor com o campo final 'platformService'
public class PlatformController {
    private final PlatformService platformService; // Torne o campo final


    @GetMapping()
    public ResponseEntity<List<Platform>> findAll(){
        List<Platform> platforms = platformService.findAll();
        return ResponseEntity.ok(platforms);
    }
}