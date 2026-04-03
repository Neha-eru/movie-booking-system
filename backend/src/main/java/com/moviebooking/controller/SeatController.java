package com.moviebooking.controller;

import com.moviebooking.dto.SeatDTO;
import com.moviebooking.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    // GET /api/seats/show/{showId}
    @GetMapping("/show/{showId}")
    public ResponseEntity<List<SeatDTO>> getSeatsByShow(@PathVariable Long showId) {
        return ResponseEntity.ok(seatService.getSeatsByShow(showId));
    }

    // GET /api/seats/show/{showId}/available
    @GetMapping("/show/{showId}/available")
    public ResponseEntity<List<SeatDTO>> getAvailableSeats(@PathVariable Long showId) {
        return ResponseEntity.ok(seatService.getAvailableSeats(showId));
    }
}