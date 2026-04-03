package com.moviebooking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)   // 🔥 CHANGE
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)   // 🔥 CHANGE
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @ElementCollection(fetch = FetchType.EAGER)   // 🔥 ADD THIS
    @CollectionTable(name = "booking_seats",
            joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "seat_number")
    private List<String> bookedSeats;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status")
    private BookingStatus bookingStatus = BookingStatus.CONFIRMED;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PAID;

    @Column(name = "booking_reference", unique = true)
    private String bookingReference;

    @CreationTimestamp
    @Column(name = "booked_at", updatable = false)
    private LocalDateTime bookedAt;

    public enum BookingStatus {
        CONFIRMED, CANCELLED, PENDING
    }

    public enum PaymentStatus {
        PAID, PENDING, REFUNDED
    }
}