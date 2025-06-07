import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { BookingsTable, TIBooking } from "../Drizzle/schema";

// Create a new booking
export const createBookingService = async (booking: TIBooking) => {
    try{const newBooking = await db.insert(BookingsTable).values(booking).returning();
    return newBooking[0];
}catch (error) {
 console.error("Error creating booking:", error);
 throw error;
}
    

};

// Get one booking by ID, including related car and location
export const getOneBookingService = async (bookingID: number) => {
    return await db.query.BookingsTable.findFirst({
        columns: {
            bookingID: true,
            customerID: true,
            rentalStartDate: true,
            rentalEndDate: true,
            totalAmount: true
        },
        where: eq(BookingsTable.bookingID, bookingID),
        with: {
            car: {
                columns: {
                    carID: true,
                    carModel: true,
                    year: true,
                    color: true,
                    rentalRate: true
                },
                with: {
                    location: {
                        columns: {
                            locationID: true,
                            locationName: true,
                            address: true,
                            contactNumber: true
                        }
                    }
                }
            }
        }
    });
};

// Get all bookings with related car and location
export const getAllBookingService = async () => {
    return await db.query.BookingsTable.findMany({
        columns: {
            bookingID: true,
            customerID: true,
            rentalStartDate: true,
            rentalEndDate: true,
            totalAmount: true
        },
        with: {
            car: {
                columns: {
                    carID: true,
                    carModel: true,
                    year: true,
                    color: true,
                    rentalRate: true
                },
                with: {
                    location: {
                        columns: {
                            locationID: true,
                            locationName: true,
                            address: true,
                            contactNumber: true
                        }
                    }
                }
            }
        }
    });
};

// Update a booking
export const updateBookingService = async (bookingID: number, booking: Partial<TIBooking>) => {
    const updatedBooking = await db.update(BookingsTable)
        .set(booking)
        .where(eq(BookingsTable.bookingID, bookingID))
        .returning();
    return updatedBooking[0];
};

// Delete a booking
export const deleteBookingService = async (bookingID: number) => {
    const deleted = await db.delete(BookingsTable)
        .where(eq(BookingsTable.bookingID, bookingID))
        .returning();
    return deleted.length > 0;
};
