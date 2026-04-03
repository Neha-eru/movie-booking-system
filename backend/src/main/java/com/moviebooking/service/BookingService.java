package com.moviebooking.service;

import com.moviebooking.dto.BookingDTO;
import com.moviebooking.dto.BookingRequest;
import com.moviebooking.entity.*;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository  bookingRepository;
    private final UserRepository     userRepository;
    private final ShowRepository     showRepository;
    private final SeatService        seatService;
    private final ShowService        showService;

    // ── Create Booking ─────────────────────────────────────────────
    @Transactional
    public BookingDTO createBooking(BookingRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show", "id", request.getShowId()));

        if (show.getAvailableSeats() < request.getSelectedSeats().size()) {
            throw new IllegalArgumentException(
                    "Not enough seats available. Only " + show.getAvailableSeats() + " seats left.");
        }

        // Book the seats
        seatService.bookSeats(show.getId(), request.getSelectedSeats());

        // Calculate total amount
        BigDecimal totalAmount = show.getTicketPrice()
                .multiply(BigDecimal.valueOf(request.getSelectedSeats().size()));

        // Generate booking reference
        String reference = "MBK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .user(user)
                .show(show)
                .bookedSeats(request.getSelectedSeats())
                .totalAmount(totalAmount)
                .bookingStatus(Booking.BookingStatus.CONFIRMED)
                .paymentStatus(Booking.PaymentStatus.PAID)
                .bookingReference(reference)
                .build();

        Booking saved = bookingRepository.save(booking);

        // Update seats
        showService.updateAvailableSeats(show.getId(), request.getSelectedSeats().size());

        return toDTO(saved);
    }

    // ── Get Booking By ID ──────────────────────────────────────────
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        return toDTO(booking);
    }

    // ── Get Booking By Reference ───────────────────────────────────
    public BookingDTO getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking", "reference", reference));
        return toDTO(booking);
    }

    // ── Get User Booking History ───────────────────────────────────
    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findBookingHistoryByUser(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Get All Bookings (Admin) ───────────────────────────────────
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Cancel Booking ─────────────────────────────────────────────
    @Transactional
    public BookingDTO cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to cancel this booking.");
        }

        if (booking.getBookingStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled.");
        }

        // Release seats
        seatService.releaseSeats(booking.getShow().getId(), booking.getBookedSeats());

        // Restore seats
        showService.updateAvailableSeats(
                booking.getShow().getId(),
                -booking.getBookedSeats().size()
        );

        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
        booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED);

        return toDTO(bookingRepository.save(booking));
    }

    // ── Entity → DTO ───────────────────────────────────────────────
    public BookingDTO toDTO(Booking booking) {
        Show show = booking.getShow();
        return BookingDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .username(booking.getUser().getUsername())
                .showId(show.getId())

                // 🔥 ONLY FIX (NO OTHER CHANGE)
                .movieTitle(show.getMovieTitle())

                .showDate(show.getShowDate().toString())
                .showTime(show.getShowTime().toString())
                .hallName(show.getHallName())
                .bookedSeats(booking.getBookedSeats())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus())
                .paymentStatus(booking.getPaymentStatus())
                .bookingReference(booking.getBookingReference())
                .bookedAt(booking.getBookedAt())
                .build();
    }
}