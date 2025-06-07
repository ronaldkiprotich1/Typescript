import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { LocationTable, TILocation } from "../Drizzle/schema";

// Create a new location
export const createLocationService = async (location: TILocation) => {
    try {
        const newLocation = await db.insert(LocationTable).values(location).returning();
        return newLocation[0];
    } catch (error) {
        console.error("Error creating location:", error);
        throw error;
    }
};

// Get one location by ID
export const getLocationService = async (locationID: number) => {
    try {
        return await db.query.LocationTable.findFirst({
            columns: {
                locationID: true,
                locationName: true,
                address: true,
                contactNumber: true
            },
            where: eq(LocationTable.locationID, locationID)
        });
    } catch (error) {
        console.error("Error getting location:", error);
        throw error;
    }
};

// Get all locations with their related cars
export const getAllLocationsService = async () => {
    try {
        return await db.query.LocationTable.findMany({
            columns: {
                locationID: true,
                locationName: true,
                address: true,
                contactNumber: true
            },
            with: {
                cars: {
                    columns: {
                        carID: true,
                        carModel: true,
                        year: true,
                        color: true,
                        availability: true,
                        rentalRate: true
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error getting all locations:", error);
        throw error;
    }
};

// Update a location
export const updateLocationService = async (locationID: number, locationData: Partial<TILocation>) => {
    try {
        const updated = await db.update(LocationTable)
            .set(locationData)
            .where(eq(LocationTable.locationID, locationID))
            .returning();
        return updated[0];
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
};

// Delete a location
export const deleteLocationService = async (locationID: number) => {
    try {
        const deleted = await db.delete(LocationTable)
            .where(eq(LocationTable.locationID, locationID))
            .returning();
        return deleted.length > 0;
    } catch (error) {
        console.error("Error deleting location:", error);
        throw error;
    }
};