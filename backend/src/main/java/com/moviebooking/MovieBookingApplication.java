package com.moviebooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class MovieBookingApplication {

    public static void main(String[] args) {

        // print an encoded password for convenience during development
        System.out.println(new BCryptPasswordEncoder().encode("admin123"));

        SpringApplication.run(MovieBookingApplication.class, args);
    }
}