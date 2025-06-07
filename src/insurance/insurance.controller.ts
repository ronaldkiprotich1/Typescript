

import { Request, Response } from "express";
import {
    createInsuranceService,
    getInsuranceService,
    getAllInsurancesService,
    updateInsuranceService,
    deleteInsuranceService
} from "./insurance.service";
                     
export const createInsuranceController = async (req: Request, res: Response) => {
    try {
        const insurance = req.body;
console.log("Incoming insurance payload:", insurance); 

        const newInsurance = await createInsuranceService(insurance);
        res.status(201).json(newInsurance);
    } catch (error) {
        console.error("Create Insurance Error:", error);
        res.status(500).json({ message: "Failed to create insurance" });
    }
};

export const getInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceID = Number(req.params.id);
        const insurance = await getInsuranceService(insuranceID);
        if (!insurance) return res.status(404).json({ message: "Insurance not found" });
        res.status(200).json(insurance);
    } catch (error) {
        console.error("Get Insurance Error:", error);
        res.status(500).json({ message: "Failed to retrieve insurance" });
    }
};

export const getAllInsurancesController = async (_req: Request, res: Response) => {
    try {
        const insurances = await getAllInsurancesService();
        res.status(200).json(insurances);
    } catch (error) {
        console.error("Get All Insurances Error:", error);
        res.status(500).json({ message: "Failed to retrieve insurances" });
    }
};

export const updateInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceID = Number(req.params.id);
        const insuranceData = req.body;
        const updatedInsurance = await updateInsuranceService(insuranceID, insuranceData);
        if (!updatedInsurance) return res.status(404).json({ message: "Insurance not found or not updated" });
        res.status(200).json(updatedInsurance);
    } catch (error) {
        console.error("Update Insurance Error:", error);
        res.status(500).json({ message: "Failed to update insurance" });
    }
};

export const deleteInsuranceController = async (req: Request, res: Response) => {
    try {
        const insuranceID = Number(req.params.id);
        const deletedInsurance = await deleteInsuranceService(insuranceID);
        if (!deletedInsurance) return res.status(404).json({ message: "Insurance not found or already deleted" });
        res.status(200).json({ message: "Insurance deleted successfully" });
    } catch (error) {
        console.error("Delete Insurance Error:", error);
        res.status(500).json({ message: "Failed to delete insurance" });
    }
};
