// In ShowService constructor injection, add @Lazy to SeatService:
package com.moviebooking.service;

import com.moviebooking.dto.ShowDTO;
import com.moviebooking.entity.Movie;
import com.moviebooking.entity.Show;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {

    private final ShowRepository  showRepository;
    private final MovieRepository movieRepository;
    private final SeatService     seatService;

    // Use @Lazy to break circular dependency
    public ShowService(ShowRepository showRepository,
                       MovieRepository movieRepository,
                       @Lazy SeatService seatService) {
        this.showRepository  = showRepository;
        this.movieRepository = movieRepository;
        this.seatService     = seatService;
    }

    // ── Get Shows By Movie ─────────────────────────────────────────
    public List<ShowDTO> getShowsByMovie(Long movieId) {
        return showRepository.findUpcomingShowsByMovie(movieId, LocalDate.now())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Get Show By ID ─────────────────────────────────────────────
    public ShowDTO getShowById(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show", "id", id));
        return toDTO(show);
    }

    // ── Get All Shows ──────────────────────────────────────────────
    public List<ShowDTO> getAllShows() {
        return showRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Add Show (Admin) ───────────────────────────────────────────
    @Transactional
    public ShowDTO addShow(ShowDTO dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Movie", "id", dto.getMovieId()));

        Show show = Show.builder()
                .movie(movie)

                // 🔥 ADD THIS LINE (IMPORTANT FIX)
                .movieTitle(movie.getTitle())

                .showDate(dto.getShowDate())
                .showTime(dto.getShowTime())
                .hallName(dto.getHallName())
                .totalSeats(dto.getTotalSeats())
                .availableSeats(dto.getTotalSeats())
                .ticketPrice(dto.getTicketPrice())
                .build();

        Show saved = showRepository.save(show);
        seatService.generateSeatsForShow(saved);
        return toDTO(saved);
    }

    // ── Update Show (Admin) ────────────────────────────────────────
    @Transactional
    public ShowDTO updateShow(Long id, ShowDTO dto) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show", "id", id));

        if (dto.getShowDate()    != null) show.setShowDate(dto.getShowDate());
        if (dto.getShowTime()    != null) show.setShowTime(dto.getShowTime());
        if (dto.getHallName()    != null) show.setHallName(dto.getHallName());
        if (dto.getTicketPrice() != null) show.setTicketPrice(dto.getTicketPrice());

        return toDTO(showRepository.save(show));
    }

    // ── Delete Show (Admin) ────────────────────────────────────────
    @Transactional
    public void deleteShow(Long id) {
        if (!showRepository.existsById(id)) {
            throw new ResourceNotFoundException("Show", "id", id);
        }
        showRepository.deleteById(id);
    }

    // ── Update Available Seats ─────────────────────────────────────
    @Transactional
    public void updateAvailableSeats(Long showId, int delta) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show", "id", showId));
        show.setAvailableSeats(show.getAvailableSeats() - delta);
        showRepository.save(show);
    }

    // ── Entity → DTO ───────────────────────────────────────────────
    public ShowDTO toDTO(Show show) {
        return ShowDTO.builder()
                .id(show.getId())

                // ✅ FIX: use movieTitle instead of movie object
                .movieId(null)
                .movieTitle(show.getMovieTitle())

                .showDate(show.getShowDate())
                .showTime(show.getShowTime())
                .hallName(show.getHallName())
                .totalSeats(show.getTotalSeats())
                .availableSeats(show.getAvailableSeats())
                .ticketPrice(show.getTicketPrice())
                .build();
    }
}