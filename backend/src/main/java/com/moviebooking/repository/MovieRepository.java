package com.moviebooking.repository;

import com.moviebooking.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByIsActiveTrue();

    List<Movie> findByGenreContainingIgnoreCase(String genre);

    List<Movie> findByLanguageIgnoreCase(String language);

    @Query("SELECT m FROM Movie m WHERE " +
            "LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(m.genre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(m.language) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Movie> searchMovies(@Param("keyword") String keyword);

    Boolean existsByTitleIgnoreCase(String title);
}