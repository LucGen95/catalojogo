package com.rgv.catalojogo.game.dto;

import com.rgv.catalojogo.game.entity.Game;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CreateGameDTO {
    @NotBlank(message = "title is required")
    private String title;
    private String description;
    private LocalDate releaseDate;
    private Long developerId;
    private Long publisherId;
    private String cover_url;
    @Valid
    private List<PlatformIdDto> platforms;

    @Data
    public static class PlatformIdDto {
        @NotNull(message = "platform id is required")
        private Long id;
    }

    public static CreateGameDTO toDTO(Game game) {
        CreateGameDTO dto = new CreateGameDTO();

        dto.setTitle(game.getTitle());
        dto.setDescription(game.getDescription());
        dto.setReleaseDate(game.getReleaseDate());
        dto.setDeveloperId(game.getDeveloper() != null ? game.getDeveloper().getId() : null);
        dto.setPublisherId(game.getPublisher() != null ? game.getPublisher().getId() : null);
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
