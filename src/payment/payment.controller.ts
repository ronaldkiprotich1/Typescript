import { Request, Response } from "express";
import {
  createPaymentService,
  deletePaymentService,
  getAllPaymentsService,
  getPaymentService,
  updatePaymentService,
} from "../payment/payment.service";

const parseId = (id: string) => {
  const parsed = parseInt(id);
  return isNaN(parsed) ? null : parsed;
};

const handleError = (res: Response, error: any) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};

export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const payment = req.body;
    const newPayment = await createPaymentService(payment);
    if (!newPayment) {
      return res.status(400).json({ message: "Payment creation failed" });
    }
    res.status(201).json({ message: "Payment created successfully", payment: newPayment });
  } catch (error: any) {
    
    return res.status(500).json({error: error.message})  }
};

export const getPaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = parseId(req.params.id);
    if (paymentId === null) return res.status(400).json({ message: "Invalid payment ID" });

    const payment = await getPaymentService(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ payment });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllPaymentsController = async (_req: Request, res: Response) => {
  try {
    const payments = await getAllPaymentsService();
    res.status(200).json({ payments });
  } catch (error) {
    handleError(res, error);
  }
};

export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = parseId(req.params.id);
    if (paymentId === null) return res.status(400).json({ message: "Invalid payment ID" });

    const updatedPayment = await updatePaymentService(paymentId, req.body);
    if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment updated successfully", payment: updatedPayment });
  } catch (error) {
    handleError(res, error);
  }
};

export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = parseId(req.params.id);
    if (paymentId === null) return res.status(400).json({ message: "Invalid payment ID" });

    const deletedPayment = await deletePaymentService(paymentId);
    if (!deletedPayment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
