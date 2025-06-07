import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { PaymentTable, TIPayment } from "../Drizzle/schema";

// Create a new payment
export const createPaymentService = async (payment: TIPayment) => {
    const newPayment = await db.insert(PaymentTable).values(payment).returning();
    return newPayment[0];
};

// Get one payment by ID
export const getPaymentService = async (paymentID: number) => {
    return await db.query.PaymentTable.findFirst({
        columns: {
            paymentID: true,
             bookingID: true,
            amount: true,
            paymentDate: true,
            paymentMethod: true
        },
        where: sql`${PaymentTable.paymentID} = ${paymentID}`
    });
};

// Get all payments
export const getAllPaymentsService = async () => {
    return await db.query.PaymentTable.findMany({
        columns: {
            paymentID: true,
        
            amount: true,
            paymentDate: true,
            paymentMethod: true
        }
    });
};

// Get payments for a specific reservation
export const getReservationPaymentsService = async (reservationID: number) => {
    return await db.query.PaymentTable.findMany({
        columns: {
            paymentID: true,
        
            amount: true,
            paymentDate: true,
            paymentMethod: true
        },
        where: sql`${PaymentTable.paymentID} = ${reservationID}`
    });
};

// Update a payment
export const updatePaymentService = async (paymentID: number, paymentData: Partial<TIPayment>) => {
    const updated = await db.update(PaymentTable)
        .set(paymentData)
        .where(sql`${PaymentTable.paymentID} = ${paymentID}`)
        .returning();
    return updated[0];
};

// Delete a payment
export const deletePaymentService = async (paymentID: number) => {
    const deleted = await db.delete(PaymentTable)
        .where(sql`${PaymentTable.paymentID} = ${paymentID}`)
        .returning();
    return deleted[0];
};
