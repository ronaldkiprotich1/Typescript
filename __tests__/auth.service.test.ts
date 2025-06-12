import { sql } from 'drizzle-orm';
import db from '../src/Drizzle/db';  // Correct relative import path
import { UsersTable } from '../src/Drizzle/schema';
import { 
    userLoginService,
    createUserService,
    verifyUserService
} from '../src/auth/auth.service';

// Define TIUser inline with correct role union type
interface TIUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'admin';  // restricted to these values
    isVerified: boolean;
    verificationCode: string | null;
}

// Mock the database with the correct path
jest.mock('../src/Drizzle/db', () => ({
    query: {
        UsersTable: {
            findFirst: jest.fn()
        }
    },
    insert: jest.fn(() => ({
        values: jest.fn(() => Promise.resolve())
    })),
    update: jest.fn(() => ({
        set: jest.fn(() => ({
            where: jest.fn(() => Promise.resolve())
        }))
    })),
    transaction: jest.fn()
}));

describe('Authentication Service', () => {
    const mockUser: TIUser = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'user',  // must be 'user' or 'admin'
        isVerified: true,
        verificationCode: null
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Login', () => {
        it('should find user by email', async () => {
            (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(mockUser);

            const result = await userLoginService({
                email: 'test@example.com',
                password: 'password123',
                firstName: '',
                lastName: '',
                role: 'user',
                isVerified: false,
                verificationCode: null
            });

            expect(result).toEqual(mockUser);
            expect(db.query.UsersTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.any(Object),
                columns: expect.any(Object)
            }));
        });

        it('should return null if user not found', async () => {
            (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await userLoginService({
                email: 'nonexistent@example.com',
                password: 'password123',
                firstName: '',
                lastName: '',
                role: 'user',
                isVerified: false,
                verificationCode: null
            });

            expect(result).toBeNull();
        });
    });

    describe('Registration', () => {
        it('should create a new user and return success message', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn(() => Promise.resolve())
            });

            const result = await createUserService(mockUser);

            expect(db.insert).toHaveBeenCalledWith(UsersTable);
            expect(result).toBe('User created successfully');
        });
    });

    describe('Email Verification', () => {
        it('should update user verification status', async () => {
            const mockSet = jest.fn().mockReturnThis();
            const mockWhere = jest.fn().mockReturnThis();
            (db.update as jest.Mock).mockReturnValue({
                set: mockSet,
                where: mockWhere
            });

            await verifyUserService('test@example.com');

            expect(db.update).toHaveBeenCalledWith(UsersTable);
            expect(mockSet).toHaveBeenCalledWith({ isVerified: true, verificationCode: null });
            expect(mockWhere).toHaveBeenCalledWith(sql`${UsersTable.email} = ${'test@example.com'}`);
        });
    });
});
