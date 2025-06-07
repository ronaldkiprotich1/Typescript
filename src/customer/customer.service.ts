import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { CustomerTable, TICustomer } from "../Drizzle/schema";

// Create a new customer
export const createCustomerService = async (customer: TICustomer) => {
     try {
    const newCustomer = await db.insert(CustomerTable).values(customer).returning();
    return newCustomer[0];
}catch (error) {
       console.error("Error inside createCustomerService:", error); 
      throw error;}};





// Get a customer by ID
export const getCustomerService = async (customerID: number) => {
    return await db.query.CustomerTable.findFirst({
        columns: {
            customerID: true,
            firstName: true,
            lastName: true,
            email: true,
            address: true
        },
        where: sql`${CustomerTable.customerID} = ${customerID}`
    });
};

// Get all customers
export const getAllCustomersService = async () => {
    return await db.query.CustomerTable.findMany({
        columns: {
            customerID: true,
            firstName: true,
            lastName: true,
            email: true,
            address: true
        }
    });
};

// Update a customer
export const updateCustomerService = async (customerID: number, customerData: Partial<TICustomer>) => {
    const updated = await db.update(CustomerTable)
        .set(customerData)
        .where(sql`${CustomerTable.customerID} = ${customerID}`)
        .returning();
    return updated[0];
};

// Delete a customer
export const deleteCustomerService = async (customerID: number) => {
    const deleted = await db.delete(CustomerTable)
        .where(sql`${CustomerTable.customerID} = ${customerID}`)
        .returning();
    return deleted[0];
};
