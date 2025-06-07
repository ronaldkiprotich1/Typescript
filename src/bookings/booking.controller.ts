import { Request, Response } from "express";
import {
  createBookingService,
  getAllBookingService,
  getOneBookingService,
  updateBookingService,
  deleteBookingService,
} from "./booking.service";

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const booking = req.body;
    const newBooking = await createBookingService(booking);
    if (!newBooking) {
      return res.status(400).json({ message: "Failed to create booking" });
    }
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
};

export const getOneBookingController = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);
    const booking = await getOneBookingService(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error getting booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBookingController = async (_req: Request, res: Response) => {
  try {
    const bookings = await getAllBookingService();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting all bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);
    const updatedBooking = await updateBookingService(bookingId, req.body);
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found or not updated" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);
    const deleted = await deleteBookingService(bookingId);
    if (!deleted) {
      return res.status(404).json({ message: "Booking not found or already deleted" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
