package com.moviebooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber; // e.g. A1, A2, B1, B2

    @Column(name = "seat_row")
    private String seatRow; // e.g. A, B, C

    @Column(name = "is_booked")
    private Boolean isBooked = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_type")
    private SeatType seatType = SeatType.STANDARD;

    public enum SeatType {
        STANDARD, PREMIUM, VIP
    }
}