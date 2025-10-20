package com.rgv.catalojogo.game.mapper;

import com.rgv.catalojogo.game.dto.CreateGameDTO;
import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.platform.entity.Platform;
import com.rgv.catalojogo.platform.repository.PlatformRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class GameMapper {

    private final PlatformRepository platformRepository;

    public GameMapper(PlatformRepository platformRepository) {
        this.platformRepository = platformRepository;
    }

    public Game toEntity(CreateGameDTO dto) {
        Game game = new Game();

        game.setTitle(dto.getTitle());
        game.setDescription(dto.getDescription());
        game.setReleaseDate(dto.getReleaseDate());
        game.setDeveloper(dto.getDeveloper());
        game.setPublisher(dto.getPublisher());
        game.setCover_url(dto.getCover_url());

        if (dto.getPlatforms() != null && !dto.getPlatforms().isEmpty()) {
            List<Platform> platforms = dto.getPlatforms().stream()
                    .map(p -> platformRepository.findById(p.getId())
                            .orElseThrow(() -> new RuntimeException("Platform not found: " + p.getId())))
                    .collect(Collectors.toList());
            game.setPlatforms(platforms);
        }

        return game;
    }

    public CreateGameDTO toDTO(Game game) {
        return CreateGameDTO.toDTO(game);
    }
}