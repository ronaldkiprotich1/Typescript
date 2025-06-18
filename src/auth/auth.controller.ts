import { Request, Response } from "express";
import { createUserService, getUserByEmailService, userLoginService, verifyUserService } from "./auth.service";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { sendEmail } from "../mailer/mailer";

export const createUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        
        // Check if user already exists
        const existingUser = await getUserByEmailService(user.email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = bcrypt.hashSync(user.password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = {
            ...user,
            password: hashedPassword,
            verificationCode,
            isVerified: false,
            role: "user"
        };

        const createdUser = await createUserService(newUser);

        // Send verification email
        await sendEmail(
            user.email,
            "Verify your account",
            `Hello ${user.lastName}, your verification code is: ${verificationCode}`,
            `<div>
                <h2>Hello ${user.lastName},</h2>
                <p>Your verification code is: <strong>${verificationCode}</strong></p>
                <p>Enter this code to verify your account.</p>
            </div>`
        );

        return res.status(201).json({ 
            message: "User created. Verification code sent to email.",
            user: {
                id: createdUser.id,
                email: createdUser.email,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName
            }
        });

    } catch (error: any) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const verifyUserController = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        const user = await getUserByEmailService(email);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        await verifyUserService(email);

        // Send confirmation email
        await sendEmail(
            email,
            "Account Verified Successfully",
            `Hello ${user.lastName}, your account has been verified.`,
            `<div>
                <h2>Hello ${user.lastName},</h2>
                <p>Your account has been verified successfully!</p>
            </div>`
        );

        return res.status(200).json({ message: "User verified successfully" });

    } catch (error: any) {
        console.error("Verification error:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userLoginService(email);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not verified" });
        }

        const passwordValid = bcrypt.compareSync(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                sub: user.id,
                user_id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
            },
            process.env.JWT_SECRET as string
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error("Login error:", error);
        return res.status(500).json({ error: error.message });
    }
};