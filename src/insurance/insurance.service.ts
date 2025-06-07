import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { InsuranceTable, TIInsurance } from "../Drizzle/schema";

// Create insurance
export const createInsuranceService = async (insurance: TIInsurance) => {
    const newInsurance = await db.insert(InsuranceTable).values(insurance).returning();
    return newInsurance[0];
};

// Get one insurance by ID
export const getInsuranceService = async (insuranceID: number) => {
    return await db.query.InsuranceTable.findFirst({
        where: sql`${InsuranceTable.insuranceID} = ${insuranceID}`,
        columns: {
            insuranceID: true,
            carID: true,
            insuranceProvider: true,
            policyNumber: true,
            startDate: true,
            endDate: true,
        }
    });
};

// Get all insurances
export const getAllInsurancesService = async () => {
    return await db.query.InsuranceTable.findMany({
        columns: {
            insuranceID: true,
            carID: true,
            insuranceProvider: true,
            policyNumber: true,
            startDate: true,
            endDate: true,
        }
    });
};

// Update insurance
export const updateInsuranceService = async (insuranceID: number, insuranceData: Partial<TIInsurance>) => {
    const updated = await db.update(InsuranceTable)
        .set(insuranceData)
        .where(sql`${InsuranceTable.insuranceID} = ${insuranceID}`)
        .returning();
    return updated[0];
};

// Delete insurance
export const deleteInsuranceService = async (insuranceID: number) => {
    const deleted = await db.delete(InsuranceTable)
        .where(sql`${InsuranceTable.insuranceID} = ${insuranceID}`)
        .returning();
    return deleted[0];
};
