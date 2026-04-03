package com.moviebooking.repository;

import com.moviebooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByShowId(Long showId);

    Optional<Booking> findByBookingReference(String bookingReference);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.bookedAt DESC")
    List<Booking> findBookingHistoryByUser(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b JOIN b.show s WHERE s.movie.id = :movieId")
    List<Booking> findBookingsByMovie(@Param("movieId") Long movieId);

    Boolean existsByBookingReference(String bookingReference);
}