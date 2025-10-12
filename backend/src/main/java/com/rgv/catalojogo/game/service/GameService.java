package com.rgv.catalojogo.game.service;

import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.game.projection.GamePlatformProjection;
import com.rgv.catalojogo.game.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;

    @Autowired
    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<Game> findAll(){
        return gameRepository.findAll();
    }

    public List<GamePlatformProjection> findAllGamePlatform(){
        return gameRepository.findAllGamePlatform();
    }

    public Game findGameById(Long id) {
        return gameRepository.findById(id).get();
    }
}
