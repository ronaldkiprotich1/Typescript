import { Express } from "express";
import {
    createLocationController,
    getAllLocationsController,
    getLocationController,
    updateLocationController,
    deleteLocationController
} from "../location/location.controller";

export const location = (app: Express) => {
    app.route("/location").post(
        async (req, res, next) => {
            try {
                await createLocationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/location").get(
        async (req, res, next) => {
            try {
                await getAllLocationsController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/location/:id").get(
        async (req, res, next) => {
            try {
                await getLocationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/location/:id").put(
        async (req, res, next) => {
            try {
                await updateLocationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/location/:id").delete(
        async (req, res, next) => {
            try {
                await deleteLocationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
};
