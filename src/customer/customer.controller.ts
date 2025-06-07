import { Request, Response } from "express";
import {
    createCustomerService,
    getCustomerService,
    getAllCustomersService,
    updateCustomerService,
    deleteCustomerService
} from "./customer.service"; 

// Create a new customer
export const createCustomerController = async (req: Request, res: Response) => {
    try {
        const customer = req.body;
          console.log("Customer payload:", customer);
        const newCustomer = await createCustomerService(customer);
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error("Create Customer Error:", error);
        res.status(500).json({ message: "Failed to create customer" });
    }
    
};

// Get a customer by ID
export const getCustomerController = async (req: Request, res: Response) => {
    try {
        const customerID = parseInt(req.params.id);
        const customer = await getCustomerService(customerID);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        console.error("Get Customer Error:", error);
        res.status(500).json({ message: "Failed to retrieve customer" });
    }
};

// Get all customers
export const getAllCustomersController = async (_req: Request, res: Response) => {
    try {
        const customers = await getAllCustomersService();
        res.status(200).json(customers);
    } catch (error) {
        console.error("Get All Customers Error:", error);
        res.status(500).json({ message: "Failed to retrieve customers" });
    }
};

// Update customer
export const updateCustomerController = async (req: Request, res: Response) => {
    try {
        const customerID = parseInt(req.params.id);
        const customerData = req.body;
        const updatedCustomer = await updateCustomerService(customerID, customerData);
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found or not updated" });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error("Update Customer Error:", error);
        res.status(500).json({ message: "Failed to update customer" });
    }
};

// Delete customer
export const deleteCustomerController = async (req: Request, res: Response) => {
    try {
        const customerID = parseInt(req.params.id);
        const deletedCustomer = await deleteCustomerService(customerID);
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found or already deleted" });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Delete Customer Error:", error);
        res.status(500).json({ message: "Failed to delete customer" });
    }
};
