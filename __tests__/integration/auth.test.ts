import request from 'supertest';
import app from '../../src/index'; // Your Express app
import db from '../../src/Drizzle/db';
import { UsersTable } from '../../src/Drizzle/schema';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Auth Integration Tests', () => {
  const testUser = {
    email: 'testauth@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  };

  beforeAll(async () => {
    // Clean up test data if any exists
    await db.delete(UsersTable).where(sql`${UsersTable.email} = ${testUser.email}`);
  });

  afterAll(async () => {
    // Clean up all test data
    await db.delete(UsersTable).where(sql`${UsersTable.email} = ${testUser.email}`);
  });

  describe('POST /auth/register', () => {
    it('should register a new user and return 201 status', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created. Verification code sent to email.');

      // Verify user was created in database
      const user = await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${testUser.email}`
      });

      expect(user).toBeDefined();
      expect(user?.firstName).toBe(testUser.firstName);
      expect(user?.lastName).toBe(testUser.lastName);
      expect(user?.isVerified).toBe(false);
      expect(user?.verificationCode).toBeDefined();
    });

    it('should return error if email already exists', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /auth/verify', () => {
    let verificationCode: string;

    beforeAll(async () => {
      // Get the verification code from DB
      const user = await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${testUser.email}`
      });
      verificationCode = user?.verificationCode || '';
    });

    it('should verify user with correct code and return 200 status', async () => {
      const response = await request(app)
        .post('/auth/verify')
        .send({
          email: testUser.email,
          code: verificationCode
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User verified successfully');

      // Verify user is now verified in DB
      const verifiedUser = await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${testUser.email}`
      });

      expect(verifiedUser?.isVerified).toBe(true);
      expect(verifiedUser?.verificationCode).toBeNull();
    });

    it('should return 400 with invalid verification code', async () => {
      const response = await request(app)
        .post('/auth/verify')
        .send({
          email: testUser.email,
          code: 'wrongcode'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid verification code');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .post('/auth/verify')
        .send({
          email: 'nonexistent@example.com',
          code: '123456'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      // Ensure user is verified and has known password
      await db.update(UsersTable)
        .set({ 
          isVerified: true,
          password: await bcrypt.hash(testUser.password, 10)
        })
        .where(sql`${UsersTable.email} = ${testUser.email}`);
    });

    it('should login verified user and return token', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successfull');
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});