package com.rgv.catalojogo.game.mapper;

import com.rgv.catalojogo.common.exception.BadRequestException;
import com.rgv.catalojogo.common.exception.ResourceNotFoundException;
import com.rgv.catalojogo.company.entity.Company;
import com.rgv.catalojogo.company.repository.CompanyRepository;
import com.rgv.catalojogo.game.dto.CreateGameDTO;
import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.platform.entity.Platform;
import com.rgv.catalojogo.platform.repository.PlatformRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class GameMapper {

    private final PlatformRepository platformRepository;
    private final CompanyRepository companyRepository;

    public GameMapper(PlatformRepository platformRepository, CompanyRepository companyRepository) {
        this.platformRepository = platformRepository;
        this.companyRepository = companyRepository;
    }

    public Game toEntity(CreateGameDTO dto) {
        Game game = new Game();

        game.setTitle(dto.getTitle());
        game.setDescription(dto.getDescription());
        game.setReleaseDate(dto.getReleaseDate());

        if (dto.getDeveloperId() != null) {
            if (dto.getDeveloperId() <= 0) {
                throw new BadRequestException("developerId must be greater than zero");
            }
            Company developer = companyRepository.findById(dto.getDeveloperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Developer not found: " + dto.getDeveloperId()));
            game.setDeveloper(developer);
        }

        if (dto.getPublisherId() != null) {
            if (dto.getPublisherId() <= 0) {
                throw new BadRequestException("publisherId must be greater than zero");
            }
            Company publisher = companyRepository.findById(dto.getPublisherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Publisher not found: " + dto.getPublisherId()));
            game.setPublisher(publisher);
        }

        game.setCover_url(dto.getCover_url());

        if (dto.getPlatforms() != null && !dto.getPlatforms().isEmpty()) {
            List<Platform> platforms = dto.getPlatforms().stream()
                    .peek(p -> {
                        if (p == null) {
                            throw new BadRequestException("platform item cannot be null");
                        }
                        if (p.getId() <= 0) {
                            throw new BadRequestException("platform id must be greater than zero");
                        }
                    })
                    .map(p -> platformRepository.findById(p.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Platform not found: " + p.getId())))
                    .collect(Collectors.toList());
            game.setPlatforms(platforms);
        }

        return game;
    }

    public CreateGameDTO toDTO(Game game) {
        return CreateGameDTO.toDTO(game);
    }
}
