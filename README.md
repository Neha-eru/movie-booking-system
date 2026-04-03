## Movie Booking System

A full-stack Movie Booking System built using **React (Frontend)** and **Spring Boot (Backend)**.
This application allows users to browse movies, view shows, select seats, and book tickets seamlessly.

---

## Features

## User Features

* User Registration & Login (JWT Authentication)
* Browse Movies
* View Available Shows
* Seat Selection
* Book Tickets
* View Booking History

 ## Admin Features

* Add / Manage Movies
* Schedule Shows
* Manage Seat Availability

---

## Tech Stack

### Frontend

* React.js
* Axios
* Bootstrap

### Backend

* Spring Boot
* Spring Security (JWT)
* Hibernate / JPA

### Database

* MySQL

---

##  Project Structure

###  Backend (Spring Boot)

```
movie-booking-backend/
├── src/main/java/com/moviebooking/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── repository/
│   ├── security/
│   └── service/
├── src/main/resources/
│   ├── application.properties
│   └── data.sql
├── pom.xml
└── .gitignore
```

---

###  Frontend (React)

```
movie-booking-frontend/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   │   └── admin/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── index.js
├── package.json
└── .env
```

---

##  Installation & Setup

###  Backend Setup

1. Open backend folder in IntelliJ
2. Configure MySQL database in `application.properties`
3. Run the Spring Boot application

---

###  Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

##  Authentication

* JWT-based authentication is implemented
* Secure API endpoints using Spring Security

---

##  Future Enhancements

* Online Payment Integration
* Email Notifications
* Admin Dashboard Improvements
* Movie Search & Filters

---

##  Author

**Neha**
GitHub: https://github.com/Neha-eru

---

##  Conclusion

This project demonstrates a complete full-stack application with authentication, REST APIs, and real-world booking functionality.
