# Shoppers Stop — E-Commerce Web Application

A React-based e-commerce web application built as a portfolio project to practice authentication, product browsing, shopping workflows, Firebase/Firestore integration, protected routes, and admin functionality.

## Features

- User authentication with Firebase Authentication
- Product listing and product details
- Product search and filtering
- Shopping bag/cart
- Wishlist/favourites
- Checkout and order-confirmation flow
- Mock payment/checkout process (not a real payment gateway)
- Order management
- Admin area with product, order, and user management screens
- Protected user and admin routes
- Light/dark theme toggle
- Responsive interface
- Toast notifications

## Tech Stack

- React
- JavaScript
- React Router
- Firebase Authentication
- Cloud Firestore
- React Bootstrap / Bootstrap
- Axios
- React Icons
- React Toastify
- Vite

## Project Structure

The application separates UI/layout components, API-related code, authentication, context state, Firebase configuration, user-facing pages, and admin screens.

## Important Implementation Notes

- Firebase is used for authentication and application data.
- The checkout flow includes a mock payment process; it should not be described as a production payment gateway integration.
- The project uses Context-based application state rather than Redux.
- Admin routes are protected separately from normal user routes.

## Running Locally

```bash
npm install
npm run dev
```

Create/configure the Firebase project required by the application before using authentication or Firestore features.

## Build

```bash
npm run build
```

## Deployment

The repository is configured for GitHub Pages deployment.

Live demo:
https://AshDCode.github.io/shoppers-stop

Repository:
https://github.com/AshDcode/shoppers-stop

## Portfolio Value

This project demonstrates practical frontend work with React, routing, authentication, Firestore-backed application flows, reusable UI components, protected routes, and a more complete e-commerce user journey.
