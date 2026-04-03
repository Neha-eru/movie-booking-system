package com.moviebooking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class SeatAlreadyBookedException extends RuntimeException {

    public SeatAlreadyBookedException(String seatNumber) {
        super("Seat " + seatNumber + " is already booked. Please choose a different seat.");
    }
}