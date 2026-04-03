package com.moviebooking.controller;

import com.moviebooking.dto.ShowDTO;
import com.moviebooking.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;

    // GET /api/shows
    @GetMapping
    public ResponseEntity<List<ShowDTO>> getAllShows() {
        return ResponseEntity.ok(showService.getAllShows());
    }

    // GET /api/shows/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ShowDTO> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getShowById(id));
    }

    // GET /api/shows/movie/{movieId}
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowDTO>> getShowsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showService.getShowsByMovie(movieId));
    }
}