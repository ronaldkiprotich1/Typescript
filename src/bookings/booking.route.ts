import { Express } from "express";
import {
  createBookingController,
  getAllBookingController,
  getOneBookingController,
  updateBookingController,
  deleteBookingController,
} from "./booking.controller";

export const booking = (app: Express) => {
  // Create a new booking
  app.route("/booking").post(async (req, res, next) => {
    try {
      await createBookingController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all bookings
  app.route("/bookings").get(async (req, res, next) => {
    try {
      await getAllBookingController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get one booking by ID
  app.route("/booking/:id").get(async (req, res, next) => {
    try {
      await getOneBookingController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update booking by ID
  app.route("/booking/:id").put(async (req, res, next) => {
    try {
      await updateBookingController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete booking by ID
  app.route("/booking/:id").delete(async (req, res, next) => {
    try {
      await deleteBookingController(req, res);
    } catch (error) {
      next(error);
    }
  });
};
