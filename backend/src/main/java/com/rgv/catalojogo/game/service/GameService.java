package com.rgv.catalojogo.game.service;

import java.util.List;

import com.rgv.catalojogo.common.exception.BadRequestException;
import com.rgv.catalojogo.common.exception.ResourceNotFoundException;
import com.rgv.catalojogo.game.dto.CreateGameDTO;
import com.rgv.catalojogo.game.mapper.GameMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.game.projection.GamePlatformProjection;
import com.rgv.catalojogo.game.repository.GameRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final GameMapper gameMapper;

    public List<Game> findAll(){
        return gameRepository.findAll();
    }

    public List<GamePlatformProjection> findAllGamePlatform(){
        return gameRepository.findAllGamePlatform();
    }

    public Game findGameById(Long id) {
        if (id == null || id <= 0) {
            throw new BadRequestException("id must be greater than zero");
        }
        return gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found: " + id));
    }

    @Transactional
    public Game saveGame(CreateGameDTO dto) {
        Game game = gameMapper.toEntity(dto);
        Game saved = gameRepository.save(game);

        return saved;
    }

    @Transactional
    public Game updateGame(Long id, CreateGameDTO dto) {
        Game game = findGameById(id);
        gameMapper.updateEntity(game, dto);
        return gameRepository.save(game);
    }

    @Transactional
    public void deleteGame(Long id) {
        Game game = findGameById(id);
        gameRepository.delete(game);
    }
}
