# EN2H Booking Platform API

A robust RESTful API built with NestJS for managing services and customer bookings, developed as the technical assessment for the EN2H Backend Engineering Internship.

## Project Overview
This platform allows administrators to manage services and customers to book those services. It is built using a domain-driven, modular monolithic architecture. 

**Key Technologies Used:**
- NestJS (TypeScript)
- PostgreSQL with TypeORM
- JWT Authentication (Passport)
- Swagger for API Documentation
- Class-Validator & Class-Transformer for DTO validation

**Implemented Bonus Features:**
1. Global Exception Handling
2. Swagger API Documentation
3. Prevent duplicate bookings for the same service, date, and time

---

## Installation Steps

1. Clone the repository
2. Install dependencies:
```bash
npm install