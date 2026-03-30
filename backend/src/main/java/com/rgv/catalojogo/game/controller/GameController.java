package com.rgv.catalojogo.game.controller;

import java.util.List;

import com.rgv.catalojogo.game.dto.CreateGameDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.game.projection.GamePlatformProjection;
import com.rgv.catalojogo.game.service.GameService;

import lombok.RequiredArgsConstructor;

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

    @GetMapping("/catalog")
    public ResponseEntity<Page<Game>> searchCatalog(
            @RequestParam(name = "q", required = false) String query,
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<Game> games = gameService.searchCatalog(query, pageable);
        return ResponseEntity.ok(games);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> findGameById(@PathVariable Long id){
        Game game = gameService.findGameById(id);
        return ResponseEntity.ok(game);
    }

    @PostMapping
    public ResponseEntity<Game> createGame(@Valid @RequestBody CreateGameDTO game) {
        Game saved = gameService.saveGame(game);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable Long id, @Valid @RequestBody CreateGameDTO game) {
        Game updated = gameService.updateGame(id, game);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }
}
