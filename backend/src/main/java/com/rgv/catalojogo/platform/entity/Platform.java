package com.rgv.catalojogo.platform.entity;

import com.rgv.catalojogo.game.entity.Game;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Platform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "platforms", cascade = CascadeType.ALL)
    private List<Game> games;
}
