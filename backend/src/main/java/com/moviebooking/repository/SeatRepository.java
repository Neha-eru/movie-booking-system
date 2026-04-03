package com.moviebooking.repository;

import com.moviebooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByShowId(Long showId);

    List<Seat> findByShowIdAndIsBookedFalse(Long showId);

    List<Seat> findByShowIdAndIsBookedTrue(Long showId);

    Optional<Seat> findByShowIdAndSeatNumber(Long showId, String seatNumber);

    @Query("SELECT s FROM Seat s WHERE s.show.id = :showId AND s.seatNumber IN :seatNumbers")
    List<Seat> findByShowIdAndSeatNumbers(@Param("showId") Long showId,
                                          @Param("seatNumbers") List<String> seatNumbers);

    Boolean existsByShowIdAndSeatNumberAndIsBookedTrue(Long showId, String seatNumber);

    long countByShowIdAndIsBookedFalse(Long showId);
}