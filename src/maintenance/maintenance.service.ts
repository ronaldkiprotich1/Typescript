import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { MaintenanceTable, CarTable, LocationTable, TIMaintenance } from "../Drizzle/schema";

export const createMaintenanceService = async (maintenance: TIMaintenance) => {
    try {
        console.log("Service received maintenance data:", maintenance);
        console.log("MaintenanceTable schema:", MaintenanceTable);
        
        const newMaintenance = await db.insert(MaintenanceTable).values(maintenance).returning();
        console.log("Database insert result:", newMaintenance);
        
        return newMaintenance[0];
    } catch (error) {
        console.error("Database error in createMaintenanceService:", error);
        throw error; 
    }
};


export const getMaintenanceService = async (maintenanceID: number) => {
    try {
        console.log("Fetching maintenance with ID:", maintenanceID);
        const result = await db.query.MaintenanceTable.findFirst({
            columns: {
                maintenanceID: true,
                carID: true,
                maintenanceDate: true,
                description: true,
                cost: true,
            },
            with: {
                car: {
                    columns: {
                        carModel: true,
                        year: true,
                        color: true,
                    },
                    with: {
                        location: {
                            columns: {
                                locationName: true,
                                address: true,
                                contactNumber: true,
                            },
                        },
                    },
                },
            },
            where: sql`${MaintenanceTable.maintenanceID} = ${maintenanceID}`,
        });
        console.log("Database query result:", result);
        return result;
    } catch (error) {
        console.error("Database error in getMaintenanceService:", error);
        throw error;
    }
};


export const getAllMaintenanceService = async () => {
    try {
        console.log("Fetching all maintenance records");
        const result = await db.query.MaintenanceTable.findMany({
            columns: {
                maintenanceID: true,
                carID: true,
                maintenanceDate: true,
                description: true,
                cost: true,
            },
            with: {
                car: {
                    columns: {
                      
                        carModel: true,
                        year: true,
                        color: true,
                    },
                    with: {
                        location: {
                            columns: {
                                locationName: true,
                                address: true,
                            },
                        },
                    },
                },
            },
        });
        console.log("Database query result:", result);
        return result;
    } catch (error) {
        console.error("Database error in getAllMaintenanceService:", error);
        throw error;
    }
};

// Update maintenance
export const updateMaintenanceService = async (maintenanceID: number, maintenanceData: Partial<TIMaintenance>) => {
    try {
        console.log("Updating maintenance with ID:", maintenanceID, "Data:", maintenanceData);
        const updated = await db.update(MaintenanceTable)
            .set(maintenanceData)
            .where(sql`${MaintenanceTable.maintenanceID} = ${maintenanceID}`)
            .returning();
        console.log("Database update result:", updated);
        return updated[0];
    } catch (error) {
        console.error("Database error in updateMaintenanceService:", error);
        throw error;
    }
};

// Delete maintenance
export const deleteMaintenanceService = async (maintenanceID: number) => {
    try {
        console.log("Deleting maintenance with ID:", maintenanceID);
        const deleted = await db.delete(MaintenanceTable)
            .where(sql`${MaintenanceTable.maintenanceID} = ${maintenanceID}`)
            .returning();
        console.log("Database delete result:", deleted);
        return deleted[0];
    } catch (error) {
        console.error("Database error in deleteMaintenanceService:", error);
        throw error;
    }
};

// Get maintenance history for a specific car
export const getCarMaintenanceHistory = async (carID: number) => {
    try {
        console.log("Fetching maintenance history for car ID:", carID);
        const result = await db.query.MaintenanceTable.findMany({
            columns: {
                maintenanceID: true,
                carID: true,
                maintenanceDate: true,
                description: true,
                cost: true,
            },
            with: {
                car: {
                    columns: {
                       
                        carModel: true,
                        year: true,
                        color: true,
                        rentalRate: true,
                    },
                    with: {
                        location: {
                            columns: {
                                locationName: true,
                                address: true,
                                contactNumber: true,
                            },
                        },
                    },
                },
            },
            where: sql`${MaintenanceTable.carID} = ${carID}`,
            orderBy: sql`${MaintenanceTable.maintenanceDate} DESC`,
        });
        console.log("Database query result:", result);
        return result;
    } catch (error) {
        console.error("Database error in getCarMaintenanceHistory:", error);
        throw error;
    }
};