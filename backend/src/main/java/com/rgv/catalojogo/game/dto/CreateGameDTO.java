package com.rgv.catalojogo.game.dto;

import com.rgv.catalojogo.game.entity.Game;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CreateGameDTO {
    private String title;
    private String description;
    private LocalDate releaseDate;
    private String developer;
    private String publisher;
    private String cover_url;
    private List<PlatformIdDto> platforms;

    @Data
    public static class PlatformIdDto {
        private Long id;
    }

    public static CreateGameDTO toDTO(Game game) {
        CreateGameDTO dto = new CreateGameDTO();

        dto.setTitle(game.getTitle());
        dto.setDescription(game.getDescription());
        dto.setReleaseDate(game.getReleaseDate());
        dto.setDeveloper(game.getDeveloper());
        dto.setPublisher(game.getPublisher());
        dto.setCover_url(game.getCover_url());

        if (game.getPlatforms() != null && !game.getPlatforms().isEmpty()) {
            List<CreateGameDTO.PlatformIdDto> platformDtos = game.getPlatforms().stream()
                    .map(platform -> {
                        CreateGameDTO.PlatformIdDto pDto = new CreateGameDTO.PlatformIdDto();
                        pDto.setId(platform.getId());
                        return pDto;
                    })
                    .collect(Collectors.toList());;
            dto.setPlatforms(platformDtos);
        }

        return dto;
    }
}