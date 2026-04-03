package com.moviebooking.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDTO {

    private Long id;
    private String title;
    private String description;
    private String genre;
    private Integer duration;
    private String language;
    private Double rating;
    private String posterUrl;
    private LocalDate releaseDate;
    private Boolean isActive;
}