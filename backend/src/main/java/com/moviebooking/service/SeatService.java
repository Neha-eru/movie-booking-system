package com.moviebooking.service;

import com.moviebooking.dto.SeatDTO;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Show;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.exception.SeatAlreadyBookedException;
import com.moviebooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;

    // ── Get All Seats For Show ─────────────────────────────────────
    public List<SeatDTO> getSeatsByShow(Long showId) {
        return seatRepository.findByShowId(showId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Get Available Seats For Show ───────────────────────────────
    public List<SeatDTO> getAvailableSeats(Long showId) {
        return seatRepository.findByShowIdAndIsBookedFalse(showId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Generate Seats For New Show ────────────────────────────────
    @Transactional
    public void generateSeatsForShow(Show show) {
        List<Seat> seats = new ArrayList<>();
        String[] rows = {"A", "B", "C", "D", "E", "F"};
        int seatsPerRow = show.getTotalSeats() / rows.length;

        for (String row : rows) {
            for (int i = 1; i <= seatsPerRow; i++) {
                Seat.SeatType type = switch (row) {
                    case "A", "B" -> Seat.SeatType.VIP;
                    case "C", "D" -> Seat.SeatType.PREMIUM;
                    default       -> Seat.SeatType.STANDARD;
                };

                Seat seat = Seat.builder()
                        .show(show)
                        .seatNumber(row + i)
                        .seatRow(row)
                        .isBooked(false)
                        .seatType(type)
                        .build();
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
    }

    // ── Book Selected Seats ────────────────────────────────────────
    @Transactional
    public void bookSeats(Long showId, List<String> seatNumbers) {
        for (String seatNumber : seatNumbers) {
            // Check if already booked
            if (seatRepository.existsByShowIdAndSeatNumberAndIsBookedTrue(showId, seatNumber)) {
                throw new SeatAlreadyBookedException(seatNumber);
            }
        }

        List<Seat> seats = seatRepository.findByShowIdAndSeatNumbers(showId, seatNumbers);

        if (seats.size() != seatNumbers.size()) {
            throw new ResourceNotFoundException("One or more seats not found for this show.");
        }

        seats.forEach(seat -> seat.setIsBooked(true));
        seatRepository.saveAll(seats);
    }

    // ── Release Seats (for cancellation) ──────────────────────────
    @Transactional
    public void releaseSeats(Long showId, List<String> seatNumbers) {
        List<Seat> seats = seatRepository.findByShowIdAndSeatNumbers(showId, seatNumbers);
        seats.forEach(seat -> seat.setIsBooked(false));
        seatRepository.saveAll(seats);
    }

    // ── Entity → DTO ───────────────────────────────────────────────
    public SeatDTO toDTO(Seat seat) {
        return SeatDTO.builder()
                .id(seat.getId())
                .showId(seat.getShow().getId())
                .seatNumber(seat.getSeatNumber())
                .seatRow(seat.getSeatRow())
                .isBooked(seat.getIsBooked())
                .seatType(seat.getSeatType())
                .build();
    }
}