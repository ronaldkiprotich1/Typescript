import { Request, Response } from "express";
import {
    createMaintenanceService,
    getMaintenanceService,
    getAllMaintenanceService,
    updateMaintenanceService,
    deleteMaintenanceService,
    getCarMaintenanceHistory // Import the new service function
} from "./maintenance.service";

const isValidId = (id: number) => Number.isInteger(id) && id > 0;

export const createMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenance = req.body;
        // Optional: validate required fields here or use middleware
        console.log("Incoming maintenance payload:", maintenance);
        const newMaintenance = await createMaintenanceService(maintenance);
        res.status(201).json({ success: true, data: newMaintenance });
    } catch (error) {
        console.error("Create Maintenance Error:", error);
        res.status(500).json({ success: false, message: "Failed to create maintenance record" });
    }
};

export const getMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceID = Number(req.params.id);
        if (!isValidId(maintenanceID)) {
            return res.status(400).json({ success: false, message: "Invalid maintenance ID" });
        }

        const maintenance = await getMaintenanceService(maintenanceID);
        if (!maintenance) {
            return res.status(404).json({ success: false, message: "Maintenance record not found" });
        }
        res.status(200).json({ success: true, data: maintenance });
    } catch (error) {
        console.error("Get Maintenance Error:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve maintenance record" });
    }
};

export const getAllMaintenanceController = async (_req: Request, res: Response) => {
    try {
        const records = await getAllMaintenanceService();
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        console.error("Get All Maintenance Error:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve maintenance records" });
    }
};

export const updateMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceID = Number(req.params.id);
        if (!isValidId(maintenanceID)) {
            return res.status(400).json({ success: false, message: "Invalid maintenance ID" });
        }

        const updateData = req.body;
        const updated = await updateMaintenanceService(maintenanceID, updateData);

        if (!updated) {
            return res.status(404).json({ success: false, message: "Maintenance record not found or not updated" });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Update Maintenance Error:", error);
        res.status(500).json({ success: false, message: "Failed to update maintenance record" });
    }
};

export const deleteMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceID = Number(req.params.id);
        if (!isValidId(maintenanceID)) {
            return res.status(400).json({ success: false, message: "Invalid maintenance ID" });
        }

        const deleted = await deleteMaintenanceService(maintenanceID);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Maintenance record not found or already deleted" });
        }

        res.status(200).json({ success: true, message: "Maintenance record deleted successfully" });
    } catch (error) {
        console.error("Delete Maintenance Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete maintenance record" });
    }
};

export const getCarMaintenanceHistoryController = async (req: Request, res: Response) => {
    try {
        const carID = Number(req.params.carId);
        if (!isValidId(carID)) {
            return res.status(400).json({ success: false, message: "Invalid car ID" });
        }

        console.log("Fetching maintenance history for car ID:", carID);
        const maintenanceHistory = await getCarMaintenanceHistory(carID);
        if (!maintenanceHistory || maintenanceHistory.length === 0) {
            return res.status(404).json({ success: false, message: "No maintenance records found for this car" });
        }

        res.status(200).json({ success: true, data: maintenanceHistory });
    } catch (error) {
        console.error("Get Car Maintenance History Error:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve maintenance history" });
    }
};