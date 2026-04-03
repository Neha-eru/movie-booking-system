package com.moviebooking.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowDTO {

    private Long id;
    private Long movieId;
    private String movieTitle;
    private LocalDate showDate;
    private LocalTime showTime;
    private String hallName;
    private Integer totalSeats;
    private Integer availableSeats;
    private BigDecimal ticketPrice;
}