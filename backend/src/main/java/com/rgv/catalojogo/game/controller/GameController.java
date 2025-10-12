package com.rgv.catalojogo.game.controller;


import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.game.projection.GamePlatformProjection;
import com.rgv.catalojogo.game.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/catalojogos/v1/games")
public class GameController {

    private final GameService gameService;

    @GetMapping
    public ResponseEntity<List<Game>> findAll(){
        List<Game> games = gameService.findAll();
        return ResponseEntity.ok(games);
    }

    @GetMapping("/platforms")
    public ResponseEntity<List<GamePlatformProjection>> findAllGamePlatforms(){
        List<GamePlatformProjection> gamesPlatforms = gameService.findAllGamePlatform();
        return ResponseEntity.ok(gamesPlatforms);
    }
}
