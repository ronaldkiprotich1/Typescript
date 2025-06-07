import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { ReservationTable, TIReservation } from "../Drizzle/schema";

// Create a new reservation
export const createReservationService = async (reservation: TIReservation) => {
    try {
        const newReservation = await db.insert(ReservationTable).values(reservation).returning();
        return newReservation[0];
    } catch (error) {
        console.error("Error creating reservation:", error);
        throw error;
    }
};

// Get a reservation by ID
export const getReservationService = async (reservationID: number) => {
    try {
        return await db.query.ReservationTable.findFirst({
            columns: {
                reservationID: true,
                customerID: true,
                carID: true,
                reservationDate: true,
                pickupDate: true,
                returnDate: true
            },
            where: eq(ReservationTable.reservationID, reservationID)
        });
    } catch (error) {
        console.error("Error fetching reservation:", error);
        throw error;
    }
};

// Get all reservations
export const getAllReservationsService = async () => {
    try {
        return await db.query.ReservationTable.findMany({
            columns: {
                reservationID: true,
                customerID: true,
                carID: true,
                reservationDate: true,
                pickupDate: true,
                returnDate: true
            }
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        throw error;
    }
};

// Update a reservation
export const updateReservationService = async (reservationID: number, data: Partial<TIReservation>) => {
    try {
        const updated = await db.update(ReservationTable)
            .set(data)
            .where(eq(ReservationTable.reservationID, reservationID))
            .returning();
        return updated[0];
    } catch (error) {
        console.error("Error updating reservation:", error);
        throw error;
    }
};

// Delete a reservation
export const deleteReservationService = async (reservationID: number) => {
    try {
        const deleted = await db.delete(ReservationTable)
            .where(eq(ReservationTable.reservationID, reservationID))
            .returning();
        return deleted[0];
    } catch (error) {
        console.error("Error deleting reservation:", error);
        throw error;
    }
};
