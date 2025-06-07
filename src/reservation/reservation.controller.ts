import { Request, Response } from "express";
import {
    createReservationService,
    getReservationService,
    getAllReservationsService,
    updateReservationService,
    deleteReservationService
} from "../reservation/reservation.service"; 
// Create a new reservation
export const createReservationController = async (req: Request, res: Response) => {
    try {
        const reservation = req.body;
        const newReservation = await createReservationService(reservation);
        res.status(201).json(newReservation);
    } catch (error) {
        console.error("Create Reservation Error:", error);
        res.status(500).json({ message: "Failed to create reservation" });
    }
};

// Get one reservation by ID
export const getReservationController = async (req: Request, res: Response) => {
    try {
        const reservationID = parseInt(req.params.id);
        const reservation = await getReservationService(reservationID);

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json(reservation);
    } catch (error) {
        console.error("Get Reservation Error:", error);
        res.status(500).json({ message: "Failed to retrieve reservation" });
    }
};

// Get all reservations
export const getAllReservationsController = async (_req: Request, res: Response) => {
    try {
        const reservations = await getAllReservationsService();
        res.status(200).json(reservations);
    } catch (error) {
        console.error("Get All Reservations Error:", error);
        res.status(500).json({ message: "Failed to retrieve reservations" });
    }
};

// Update reservation
export const updateReservationController = async (req: Request, res: Response) => {
    try {
        const reservationID = parseInt(req.params.id);
        const updateData = req.body;

        const updatedReservation = await updateReservationService(reservationID, updateData);

        if (!updatedReservation) {
            return res.status(404).json({ message: "Reservation not found or not updated" });
        }

        res.status(200).json(updatedReservation);
    } catch (error) {
        console.error("Update Reservation Error:", error);
        res.status(500).json({ message: "Failed to update reservation" });
    }
};

// Delete reservation
export const deleteReservationController = async (req: Request, res: Response) => {
    try {
        const reservationID = parseInt(req.params.id);
        const deletedReservation = await deleteReservationService(reservationID);

        if (!deletedReservation) {
            return res.status(404).json({ message: "Reservation not found or already deleted" });
        }

        res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Delete Reservation Error:", error);
        res.status(500).json({ message: "Failed to delete reservation" });
    }
};
