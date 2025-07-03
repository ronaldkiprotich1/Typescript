import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { booking } from "./bookings/booking.route";
import { maintenance } from "./maintenance/maintenance.route";
import { payment } from "./payment/payment.route";
import { reservation } from "./reservation/reservation.route";
import { customer } from "./customer/customer.route";
import { location } from "./location/location.route";
import { insurance } from "./insurance/insurance.route";
import { car } from "./car/car.route";
import { userRoleAuth } from "./middleware/bearAuth";
import user from "./auth/auth.router";

dotenv.config();

const initializeApp = () => {
  const app = express();

  // ✅ Updated CORS configuration
  app.use(cors({
    origin: "http://localhost:5173", // frontend dev URL
    credentials: true,              // allows cookies & authorization headers
  }));

  // Middleware
  app.use(express.json());

  // Health check
  app.get("/", (req, res) => {
    res.send("hello");
  });

  app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy");
  });

  // Register routes
  maintenance(app);
  booking(app);
  payment(app);
  reservation(app);
  customer(app);
  location(app);
  insurance(app);
  car(app);
  user(app); // Auth routes

  return app;
};

const app = initializeApp();
export default app;
