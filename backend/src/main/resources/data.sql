-- =====================================================
-- CineBook Sample Data
-- Run ONCE after creating the database.
-- In application.properties set: spring.sql.init.mode=never
-- after the first run to prevent re-execution.
-- =====================================================

-- Admin user: password = admin123
-- BCrypt hash generated with strength 10
INSERT IGNORE INTO users (id, username, email, password, role, created_at)
VALUES (
  1,
  'admin',
  'admin@moviebooking.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'ADMIN',
  NOW()
);

-- Regular user: password = user123
-- BCrypt hash generated with strength 10
INSERT IGNORE INTO users (id, username, email, password, role, created_at)
VALUES (
  2,
  'john',
  'john@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'USER',
  NOW()
);

-- =====================================================
-- MOVIES
-- =====================================================
INSERT IGNORE INTO movies (id, title, description, genre, duration, language, rating, poster_url, release_date, is_active)
VALUES
(1, 'Avengers: Endgame',
 'The epic conclusion to the Infinity Saga. The Avengers assemble once more to reverse the devastation caused by Thanos.',
 'Action/Sci-Fi', 181, 'English', 8.4,
 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
 '2019-04-26', true),

(2, 'RRR',
 'A fictional story about two legendary revolutionaries and their journey far from home.',
 'Action/Drama', 187, 'Telugu', 7.8,
 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO7vh8I0Z1rS0Kaz.jpg',
 '2022-03-25', true),

(3, 'Interstellar',
 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.',
 'Sci-Fi/Drama', 169, 'English', 8.6,
 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
 '2014-11-07', true),

(4, 'KGF Chapter 2',
 'Rocky takes control of the Kolar Gold Fields and his name strikes fear in the heart of his enemies.',
 'Action', 168, 'Kannada', 8.2,
 'https://image.tmdb.org/t/p/w500/4j3DG2AM4HxGQtBiW1UMkBh0sxp.jpg',
 '2022-04-14', true),

(5, 'Dune: Part Two',
 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
 'Sci-Fi/Adventure', 166, 'English', 8.5,
 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
 '2024-03-01', true);

-- =====================================================
-- SHOWS  (use future dates relative to 2025-08-01)
-- =====================================================
INSERT IGNORE INTO shows (id, movie_id, show_date, show_time, hall_name, total_seats, available_seats, ticket_price)
VALUES
(1,  1, '2025-08-10', '10:00:00', 'Hall A', 60, 60, 250.00),
(2,  1, '2025-08-10', '14:00:00', 'Hall B', 60, 60, 250.00),
(3,  1, '2025-08-10', '18:00:00', 'Hall A', 60, 60, 300.00),
(4,  2, '2025-08-11', '11:00:00', 'Hall C', 60, 60, 200.00),
(5,  2, '2025-08-11', '15:00:00', 'Hall C', 60, 60, 200.00),
(6,  3, '2025-08-12', '09:00:00', 'Hall B', 60, 60, 220.00),
(7,  3, '2025-08-12', '13:00:00', 'Hall A', 60, 60, 220.00),
(8,  4, '2025-08-13', '16:00:00', 'Hall C', 60, 60, 180.00),
(9,  5, '2025-08-14', '12:00:00', 'Hall B', 60, 60, 280.00),
(10, 5, '2025-08-14', '17:00:00', 'Hall A', 60, 60, 280.00);