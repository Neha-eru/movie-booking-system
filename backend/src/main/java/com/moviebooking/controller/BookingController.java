package com.moviebooking.controller;

import com.moviebooking.dto.BookingDTO;
import com.moviebooking.dto.BookingRequest;
import com.moviebooking.entity.User;
import com.moviebooking.repository.UserRepository;
import com.moviebooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    // POST /api/bookings
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        BookingDTO booking = bookingService.createBooking(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // GET /api/bookings/my
    @GetMapping("/my")
    public ResponseEntity<List<BookingDTO>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    // GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // GET /api/bookings/reference/{ref}
    @GetMapping("/reference/{ref}")
    public ResponseEntity<BookingDTO> getBookingByReference(@PathVariable String ref) {
        return ResponseEntity.ok(bookingService.getBookingByReference(ref));
    }

    // PUT /api/bookings/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

    // ── Helper ─────────────────────────────────────────────────────
    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}