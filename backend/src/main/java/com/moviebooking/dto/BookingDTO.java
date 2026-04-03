package com.moviebooking.dto;

import com.moviebooking.entity.Booking;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {

    private Long id;
    private Long userId;
    private String username;
    private Long showId;
    private String movieTitle;
    private String showDate;
    private String showTime;
    private String hallName;
    private List<String> bookedSeats;
    private BigDecimal totalAmount;
    private Booking.BookingStatus bookingStatus;
    private Booking.PaymentStatus paymentStatus;
    private String bookingReference;
    private LocalDateTime bookedAt;
}