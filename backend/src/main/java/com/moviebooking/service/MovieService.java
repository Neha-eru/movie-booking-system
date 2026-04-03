package com.moviebooking.service;

import com.moviebooking.dto.MovieDTO;
import com.moviebooking.entity.Movie;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    // ── Get All Active Movies ──────────────────────────────────────
    public List<MovieDTO> getAllActiveMovies() {
        return movieRepository.findByIsActiveTrue()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Get All Movies (Admin) ─────────────────────────────────────
    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Get Movie By ID ────────────────────────────────────────────
    public MovieDTO getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
        return toDTO(movie);
    }

    // ── Search Movies ──────────────────────────────────────────────
    public List<MovieDTO> searchMovies(String keyword) {
        return movieRepository.searchMovies(keyword)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Add Movie (Admin) ──────────────────────────────────────────
    @Transactional
    public MovieDTO addMovie(MovieDTO dto) {
        Movie movie = Movie.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .genre(dto.getGenre())
                .duration(dto.getDuration())
                .language(dto.getLanguage())
                .rating(dto.getRating())
                .posterUrl(dto.getPosterUrl())
                .releaseDate(dto.getReleaseDate())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Movie saved = movieRepository.save(movie);
        return toDTO(saved);
    }

    // ── Update Movie (Admin) ───────────────────────────────────────
    @Transactional
    public MovieDTO updateMovie(Long id, MovieDTO dto) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));

        if (dto.getTitle()       != null) movie.setTitle(dto.getTitle());
        if (dto.getDescription() != null) movie.setDescription(dto.getDescription());
        if (dto.getGenre()       != null) movie.setGenre(dto.getGenre());
        if (dto.getDuration()    != null) movie.setDuration(dto.getDuration());
        if (dto.getLanguage()    != null) movie.setLanguage(dto.getLanguage());
        if (dto.getRating()      != null) movie.setRating(dto.getRating());
        if (dto.getPosterUrl()   != null) movie.setPosterUrl(dto.getPosterUrl());
        if (dto.getReleaseDate() != null) movie.setReleaseDate(dto.getReleaseDate());
        if (dto.getIsActive()    != null) movie.setIsActive(dto.getIsActive());

        return toDTO(movieRepository.save(movie));
    }

    // ── Delete Movie (Admin) ───────────────────────────────────────
    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
        movie.setIsActive(false); // Soft delete
        movieRepository.save(movie);
    }

    // ── Hard Delete Movie (Admin) ──────────────────────────────────
    @Transactional
    public void hardDeleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Movie", "id", id);
        }
        movieRepository.deleteById(id);
    }

    // ── Entity → DTO ───────────────────────────────────────────────
    public MovieDTO toDTO(Movie movie) {
        return MovieDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genre(movie.getGenre())
                .duration(movie.getDuration())
                .language(movie.getLanguage())
                .rating(movie.getRating())
                .posterUrl(movie.getPosterUrl())
                .releaseDate(movie.getReleaseDate())
                .isActive(movie.getIsActive())
                .build();
    }
}