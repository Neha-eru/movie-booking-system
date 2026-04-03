package com.moviebooking.dto;

import com.moviebooking.entity.Seat;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatDTO {

    private Long id;
    private Long showId;
    private String seatNumber;
    private String seatRow;
    private Boolean isBooked;
    private Seat.SeatType seatType;
}