import { Request, Response } from "express";
import {
    createLocationService,
    getLocationService,
    getAllLocationsService,
    updateLocationService,
    deleteLocationService
} from "../location/location.service"; 
// Create a new location
export const createLocationController = async (req: Request, res: Response) => {
    try {
        const location = req.body;
        const newLocation = await createLocationService(location);
        res.status(201).json(newLocation);
    } catch (error) {
        console.error("Create Location Error:", error);
        res.status(500).json({ message: "Failed to create location" });
    }
};

// Get one location by ID
export const getLocationController = async (req: Request, res: Response) => {
    try {
        const locationID = parseInt(req.params.id);
        const location = await getLocationService(locationID);

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json(location);
    } catch (error) {
        console.error("Get Location Error:", error);
        res.status(500).json({ message: "Failed to retrieve location" });
    }
};

// Get all locations with their related cars
export const getAllLocationsController = async (_req: Request, res: Response) => {
    try {
        const locations = await getAllLocationsService();
        res.status(200).json(locations);
    } catch (error) {
        console.error("Get All Locations Error:", error);
        res.status(500).json({ message: "Failed to retrieve locations" });
    }
};

// Update location
export const updateLocationController = async (req: Request, res: Response) => {
    try {
        const locationID = parseInt(req.params.id);
        const locationData = req.body;

        const updatedLocation = await updateLocationService(locationID, locationData);

        if (!updatedLocation) {
            return res.status(404).json({ message: "Location not found or not updated" });
        }

        res.status(200).json(updatedLocation);
    } catch (error) {
        console.error("Update Location Error:", error);
        res.status(500).json({ message: "Failed to update location" });
    }
};

// Delete location
export const deleteLocationController = async (req: Request, res: Response) => {
    try {
        const locationID = parseInt(req.params.id);
        const deletedLocation = await deleteLocationService(locationID);

        if (!deletedLocation) {
            return res.status(404).json({ message: "Location not found or already deleted" });
        }

        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        console.error("Delete Location Error:", error);
        res.status(500).json({ message: "Failed to delete location" });
    }
};
