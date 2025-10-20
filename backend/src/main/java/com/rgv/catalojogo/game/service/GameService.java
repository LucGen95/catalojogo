package com.rgv.catalojogo.game.service;

import java.util.List;

import com.rgv.catalojogo.game.dto.CreateGameDTO;
import com.rgv.catalojogo.game.mapper.GameMapper;
import jakarta.transaction.Transactional;
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
    private final GameMapper gameMapper;

    public List<Game> findAll(){
        return gameRepository.findAll();
    }

    public List<GamePlatformProjection> findAllGamePlatform(){
        return gameRepository.findAllGamePlatform();
    }

    public Game findGameById(Long id) {
        return gameRepository.findById(id).get();
    }

    @Transactional
    public Game saveGame(CreateGameDTO dto) {
        Game game = gameMapper.toEntity(dto);
        Game saved = gameRepository.save(game);

        return saved;
    }
}
