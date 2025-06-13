import request from 'supertest';

import db, { pool } from '../../src/Drizzle/db';
import { PaymentTable, BookingsTable, CustomerTable, CarTable } from '../../src/Drizzle/schema';
import { eq } from 'drizzle-orm';
import app from '../../src';

describe('Payment API Integration Tests', () => {
  let paymentId: number;
  let bookingId: number;
  let customerId: number;
  let carId: number;

  // Set up test data including dependencies
  beforeAll(async () => {
    try {
      // Create a test customer first
      const [customer] = await db.insert(CustomerTable).values({
        firstName: 'Test',
        lastName: 'Customer',
        email: 'testcustomer@example.com',
        phoneNumber: '1234567890',
        address: '123 Test St',
      }).returning();
      customerId = customer.customerID;

      // Create a test car
      const [car] = await db.insert(CarTable).values({
        carModel: 'Test Car Model',
        year: '2020-01-01',
        color: 'Red',
        rentalRate: '100.00',
        availability: true,
        locationID: null,
      }).returning();
      carId = car.carID;

      // Create a test booking
      const [booking] = await db.insert(BookingsTable).values({
        carID: carId,
        customerID: customerId,
        rentalStartDate: '2025-06-15',
        rentalEndDate: '2025-06-20',
        totalAmount: '500.00',
      }).returning();
      bookingId = booking.bookingID;
    } catch (error) {
      console.error('Failed to set up test data:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Clean up in reverse order of creation
      if (paymentId) {
        await db.delete(PaymentTable).where(eq(PaymentTable.paymentID, paymentId));
      }
      if (bookingId) {
        await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, bookingId));
      }
      if (carId) {
        await db.delete(CarTable).where(eq(CarTable.carID, carId));
      }
      if (customerId) {
        await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerId));
      }
    } catch (error) {
      console.error('Failed to clean up test data:', error);
    } finally {
      await pool.end();
    }
  });

  describe('POST /payment', () => {
    it('should create a new payment', async () => {
      const paymentData = {
        bookingID: bookingId,
        paymentDate: '2025-07-01',
        amount: '150.00', // Use string for decimal type
        paymentMethod: 'Credit Card',
      };

      const response = await request(app)
        .post('/payment')
        .send(paymentData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Payment created successfully');
      expect(response.body.payment).toHaveProperty('paymentID');
      expect(response.body.payment.amount).toBe(paymentData.amount);
      expect(response.body.payment.bookingID).toBe(bookingId);
      
      paymentId = response.body.payment.paymentID;
    });

    it('should fail to create payment with missing required fields', async () => {
      const incompleteData = {
        // bookingID missing
        paymentDate: '2025-07-01',
        amount: '150.00',
      };

      const response = await request(app)
        .post('/payment')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail to create payment with invalid booking ID', async () => {
      const invalidData = {
        bookingID: 99999, // Non-existent booking ID
        paymentDate: '2025-07-01',
        amount: '150.00',
        paymentMethod: 'Credit Card',
      };

      const response = await request(app)
        .post('/payment')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /payment/:id', () => {
    it('should get a payment by ID', async () => {
      const response = await request(app)
        .get(`/payment/${paymentId}`)
        .expect(200);

      expect(response.body.payment).toHaveProperty('paymentID', paymentId);
      expect(response.body.payment).toHaveProperty('bookingID', bookingId);
    });

    it('should return 400 for invalid payment ID', async () => {
      await request(app)
        .get('/payment/invalid-id')
        .expect(400);
    });

    it('should return 404 for non-existent payment', async () => {
      await request(app)
        .get('/payment/999999')
        .expect(404);
    });
  });

  describe('GET /payment', () => {
    it('should get all payments', async () => {
      const response = await request(app)
        .get('/payment')
        .expect(200);

      expect(Array.isArray(response.body.payments)).toBe(true);
      expect(response.body.payments.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /payment/:id', () => {
    it('should update a payment', async () => {
      const updatedData = { 
        amount: '200.00',
        paymentMethod: 'Debit Card'
      };

      const response = await request(app)
        .put(`/payment/${paymentId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Payment updated successfully');
      expect(response.body.payment.amount).toBe(updatedData.amount);
      expect(response.body.payment.paymentMethod).toBe(updatedData.paymentMethod);
    });

    it('should return 400 when updating with invalid ID', async () => {
      await request(app)
        .put('/payment/invalid-id')
        .send({ amount: '100.00' })
        .expect(400);
    });

    it('should return 404 when updating non-existent payment', async () => {
      await request(app)
        .put('/payment/999999')
        .send({ amount: '100.00' })
        .expect(404);
    });
  });

  describe('DELETE /payment/:id', () => {
    it('should delete a payment', async () => {
      const response = await request(app)
        .delete(`/payment/${paymentId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Payment deleted successfully');

      // Verify payment is actually deleted
      await request(app)
        .get(`/payment/${paymentId}`)
        .expect(404);
        
      // Reset paymentId so cleanup doesn't try to delete again
      paymentId = 0;
    });

    it('should return 400 when deleting with invalid ID', async () => {
      await request(app)
        .delete('/payment/invalid-id')
        .expect(400);
    });

    it('should return 404 when deleting non-existent payment', async () => {
      await request(app)
        .delete('/payment/999999')
        .expect(404);
    });
  });
});