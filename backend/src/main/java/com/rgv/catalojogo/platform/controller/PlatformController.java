package com.rgv.catalojogo.platform.controller;

import com.rgv.catalojogo.platform.entity.Platform;
import com.rgv.catalojogo.platform.service.PlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("cadastro")
    public ResponseEntity<Platform> savePlatform(@RequestBody Platform platform){
        Platform platform3 = platformService.savePlatform(platform);
        return ResponseEntity.ok(platform3);
    }
}