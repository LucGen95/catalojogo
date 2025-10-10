package com.rgv.catalojogo.game.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.rgv.catalojogo.platform.entity.Platform;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.action.internal.OrphanRemovalAction;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 255)
    private String description;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(length = 255)
    private String developer;

    @Column(length = 255)
    private String publisher;

    @Column(length = 255)
    private String cover_url;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "game_platform",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "platform_id")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Platform> platforms;
}
