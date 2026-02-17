package com.rgv.catalojogo.game.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.rgv.catalojogo.company.entity.Company;
import com.rgv.catalojogo.platform.entity.Platform;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "games")
@ToString(exclude = "platforms")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Game implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 255)
    private String description;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @ManyToOne
    @JoinColumn(name = "developer_id")
    private Company developer;

    @ManyToOne
    @JoinColumn(name = "publisher_id")
    private Company publisher;

    @Column(length = 255 )
    private String cover_url;

    @ManyToMany()
    @JoinTable(
            name = "game_platform",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "platform_id")
    )
    @JsonManagedReference
    private List<Platform> platforms;
}
