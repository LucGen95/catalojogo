package com.rgv.catalojogo.game.repository;

import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.game.projection.GamePlatformProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    @Query(value = "select g.title, p.name from games g join game_platform gp on g.id = gp.game_id join platforms p on p.id = gp.platform_id ", nativeQuery = true)
    List<GamePlatformProjection> findAllGamePlatform();

    @Query(
            value = """
                    select distinct g
                    from Game g
                    left join g.developer developer
                    left join g.publisher publisher
                    where lower(g.title) like :pattern
                       or lower(coalesce(g.description, '')) like :pattern
                       or lower(coalesce(developer.name, '')) like :pattern
                       or lower(coalesce(publisher.name, '')) like :pattern
                    """,
            countQuery = """
                    select count(distinct g.id)
                    from Game g
                    left join g.developer developer
                    left join g.publisher publisher
                    where lower(g.title) like :pattern
                       or lower(coalesce(g.description, '')) like :pattern
                       or lower(coalesce(developer.name, '')) like :pattern
                       or lower(coalesce(publisher.name, '')) like :pattern
                    """
    )
    Page<Game> searchCatalog(@Param("pattern") String pattern, Pageable pageable);

    Game findGameById(Long id);
}
