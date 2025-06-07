import { Request, Response } from "express";
import {
  createCarService,
  getCarService,
  getAllCarsService,
  updateCarService,
  deleteCarService,
} from "./car.service";

export const createCarController = async (req: Request, res: Response) => {
  try {
    const car = req.body;
    console.log("Received car to create:", car);
    const newCar = await createCarService(car);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Create Car Error:", error);
    res.status(500).json({ message: "Failed to create car" });
  }
//   export const createCarController = async (req: Request, res: Response) => {
//   try {
//     const car = req.body;                         // Get data from request body
//     console.log("Received car to create:", car); // <-- Put it here for debugging input
//     const newCar = await createCarService(car);  // Call your service to create the car
//     res.status(201).json(newCar);                 // Send back the created car
//   } catch (error) {
//     console.error("Create Car Error:", error);   // Log error if something goes wrong
//     res.status(500).json({ message: "Failed to create car" }); // Error response
//   }
// };

};

export const getCarController = async (req: Request, res: Response) => {
  try {
    const carID = Number(req.params.id);
    const car = await getCarService(carID);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json(car);
  } catch (error) {
    console.error("Get Car Error:", error);
    res.status(500).json({ message: "Failed to retrieve car" });
  }
};

export const getAllCarsController = async (_req: Request, res: Response) => {
  try {
    const cars = await getAllCarsService();
    res.status(200).json(cars);
  } catch (error) {
    console.error("Get All Cars Error:", error);
    res.status(500).json({ message: "Failed to retrieve cars" });
  }
};

export const updateCarController = async (req: Request, res: Response) => {
  try {
    const carID = Number(req.params.id);
    const carData = req.body;
    const updatedCar = await updateCarService(carID, carData);
    if (!updatedCar) return res.status(404).json({ message: "Car not found or not updated" });
    res.status(200).json(updatedCar);
  } catch (error) {
    console.error("Update Car Error:", error);
    res.status(500).json({ message: "Failed to update car" });
  }
};

export const deleteCarController = async (req: Request, res: Response) => {
  try {
    const carID = Number(req.params.id);
    const deletedCar = await deleteCarService(carID);
    if (!deletedCar) return res.status(404).json({ message: "Car not found or already deleted" });
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Delete Car Error:", error);
    res.status(500).json({ message: "Failed to delete car" });
  }
};
