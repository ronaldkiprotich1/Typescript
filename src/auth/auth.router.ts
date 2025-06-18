import { Express } from "express";
import { 
    createUserController, 
    loginUserController, 
    verifyUserController 
} from "./auth.controller";

const authRoutes = (app: Express) => {
    app.post("/auth/register", async (req, res, next) => {
        try {
            await createUserController(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.post("/auth/verify", async (req, res, next) => {
        try {
            await verifyUserController(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.post("/auth/login", async (req, res, next) => {
        try {
            await loginUserController(req, res);
        } catch (error) {
            next(error);
        }
    });
};

export default authRoutes;