package com.moviebooking.repository;

import com.moviebooking.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByMovieId(Long movieId);

    List<Show> findByMovieIdAndShowDate(Long movieId, LocalDate showDate);

    @Query("SELECT s FROM Show s WHERE s.movie.id = :movieId AND s.showDate >= :today ORDER BY s.showDate, s.showTime")
    List<Show> findUpcomingShowsByMovie(@Param("movieId") Long movieId,
                                        @Param("today") LocalDate today);

    @Query("SELECT s FROM Show s WHERE s.showDate = :date ORDER BY s.showTime")
    List<Show> findShowsByDate(@Param("date") LocalDate date);

    @Query("SELECT s FROM Show s WHERE s.availableSeats > 0 AND s.movie.id = :movieId")
    List<Show> findAvailableShowsByMovie(@Param("movieId") Long movieId);
}