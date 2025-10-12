package com.rgv.catalojogo.game.repository;

import com.rgv.catalojogo.game.entity.Game;
import com.rgv.catalojogo.game.projection.GamePlatformProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    @Query(value = "select g.title, p.name from game g join game_platform gp on g.id = gp.game_id join platform p on p.id = gp.platform_id ", nativeQuery = true)
    List<GamePlatformProjection> findAllGamePlatform();
}
