import { Express } from "express";
import {
    createCustomerController,
    getCustomerController,
    getAllCustomersController,
    updateCustomerController,
    deleteCustomerController
} from "./customer.controller"; 
import { adminRoleAuth, checkRoles } from "../middleware/bearAuth";

export const customer = (app: Express) => {
    app.route("/customer").post(
        async (req, res, next) => {
            try {
                await createCustomerController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/customer").get(
        checkRoles("admin"),
        async (req, res, next) => {
            try {
                await getAllCustomersController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/customer/:id").get(
        async (req, res, next) => {
            try {
                await getCustomerController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/customer/:id").put(
        async (req, res, next) => {
            try {
                await updateCustomerController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/customer/:id").delete(
        async (req, res, next) => {
            try {
                await deleteCustomerController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
};
