import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { CarTable, TICar } from "../Drizzle/schema";

// Create a new car
export const createCarService = async (car: TICar) => {
  try{const newCar = await db.insert(CarTable).values(car).returning();
  return newCar[0];
}catch(error){
  console.error("DB Insert Error:", error);
  throw error;
}



};

// Get a car by ID
export const getCarService = async (carID: number) => {
  return await db.query.CarTable.findFirst({
    where: sql`${CarTable.carID} = ${carID}`,
    columns: {
      carID: true,
      carModel: true,
      year: true,
      color: true,
      rentalRate: true,
      availability: true,
      locationID: true,
    },
  });
};

// Get all cars
export const getAllCarsService = async () => {
  return await db.query.CarTable.findMany({
    columns: {
      carID: true,
      carModel: true,
      year: true,
      color: true,
      rentalRate: true,
      availability: true,
      locationID: true,
    },
  });
};

// Update a car
export const updateCarService = async (carID: number, carData: Partial<TICar>) => {
  const updated = await db
    .update(CarTable)
    .set(carData)
    .where(sql`${CarTable.carID} = ${carID}`)
    .returning();
  return updated[0];
};

// Delete a car
export const deleteCarService = async (carID: number) => {
  const deleted = await db
    .delete(CarTable)
    .where(sql`${CarTable.carID} = ${carID}`)
    .returning();
  return deleted[0];
};
