# Sha8af-EcoSystem

## Overview

The Coworking Space Management System is a web application designed to streamline the management of coworking spaces. The application allows users to book rooms and activities, manage branches, and apply discounts using promo codes. The system provides both user and admin functionalities, ensuring a smooth user experience and efficient management for admins.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Room Management](#room-management)
  - [Branch Management](#branch-management)
  - [Booking Management](#booking-management)
  - [Coupon Management](#coupon-management)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Registration and Login**: Users can sign up and log in to access the system.
- **Room Booking**: Users can view available rooms and book them for specific dates and times.
- **Branch Management**: Admins can add, update, and delete branches.
- **Room Management**: Admins can manage room details, including name, seats, description, amenities, pricing plans, and availability.
- **Booking History**: Users can view their past and upcoming bookings.
- **Promo Code Management**: Admins can create, update, and manage promo codes for discounts on bookings.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens) for secure authentication


## Installation

To run the application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3.Create a .env file in the root directory and add the required environment variables:

   ```bash
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4.Start the server:

   ```bash
    npm start
   ```
