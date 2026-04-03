package com.moviebooking.controller;

import com.moviebooking.dto.*;
import com.moviebooking.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final MovieService   movieService;
    private final ShowService    showService;
    private final BookingService bookingService;

    // ── MOVIE MANAGEMENT ───────────────────────────────────────────

    // GET /api/admin/movies
    @GetMapping("/movies")
    public ResponseEntity<List<MovieDTO>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    // POST /api/admin/movies
    @PostMapping("/movies")
    public ResponseEntity<MovieDTO> addMovie(@Valid @RequestBody MovieDTO movieDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movieService.addMovie(movieDTO));
    }

    // PUT /api/admin/movies/{id}
    @PutMapping("/movies/{id}")
    public ResponseEntity<MovieDTO> updateMovie(
            @PathVariable Long id,
            @RequestBody MovieDTO movieDTO) {
        return ResponseEntity.ok(movieService.updateMovie(id, movieDTO));
    }

    // DELETE /api/admin/movies/{id}
    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/admin/movies/{id}/hard
    @DeleteMapping("/movies/{id}/hard")
    public ResponseEntity<Void> hardDeleteMovie(@PathVariable Long id) {
        movieService.hardDeleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    // ── SHOW MANAGEMENT ────────────────────────────────────────────

    // GET /api/admin/shows
    @GetMapping("/shows")
    public ResponseEntity<List<ShowDTO>> getAllShows() {
        return ResponseEntity.ok(showService.getAllShows());
    }

    // POST /api/admin/shows
    @PostMapping("/shows")
    public ResponseEntity<ShowDTO> addShow(@RequestBody ShowDTO showDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(showService.addShow(showDTO));
    }

    // PUT /api/admin/shows/{id}
    @PutMapping("/shows/{id}")
    public ResponseEntity<ShowDTO> updateShow(
            @PathVariable Long id,
            @RequestBody ShowDTO showDTO) {
        return ResponseEntity.ok(showService.updateShow(id, showDTO));
    }

    // DELETE /api/admin/shows/{id}
    @DeleteMapping("/shows/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.noContent().build();
    }

    // ── BOOKING MANAGEMENT ─────────────────────────────────────────

    // GET /api/admin/bookings
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET /api/admin/bookings/{id}
    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
}