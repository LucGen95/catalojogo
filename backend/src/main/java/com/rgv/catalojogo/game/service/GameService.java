package com.rgv.catalojogo.game.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.game.projection.GamePlatformProjection;
import com.rgv.catalojogo.game.repository.GameRepository;
import com.rgv.catalojogo.platform.entity.Platform;
import com.rgv.catalojogo.platform.repository.PlatformRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final PlatformRepository platformRepository;

    public List<Game> findAll(){
        return gameRepository.findAll();
    }

    public List<GamePlatformProjection> findAllGamePlatform(){
        return gameRepository.findAllGamePlatform();
    }

    public Game findGameById(Long id) {
        return gameRepository.findById(id).get();
    }
    
    public Game saveGame(Game game) {
        if (game.getPlatforms() != null && !game.getPlatforms().isEmpty()) {
            List<Platform> platforms = game.getPlatforms().stream()
                    .map(p -> platformRepository.findById(p.getId())
                            .orElseThrow(() -> new RuntimeException("Platform not found: " + p.getId())))
                    .toList();

            game.setPlatforms(platforms);
        }

        return gameRepository.save(game);
    }
}
