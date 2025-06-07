import { Express } from "express";
import {
    createReservationController,
    deleteReservationController,
    getAllReservationsController,
    getReservationController,
    updateReservationController
} from "../reservation/reservation.controller"; 

export const reservation = (app: Express) => {
    app.route("/reservation").post(
        async (req, res, next) => {
            try {
                await createReservationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/reservation").get(
        async (req, res, next) => {
            try {
                await getAllReservationsController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/reservation/:id").get(
        async (req, res, next) => {
            try {
                await getReservationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/reservation/:id").put(
        async (req, res, next) => {
            try {
                await updateReservationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/reservation/:id").delete(
        async (req, res, next) => {
            try {
                await deleteReservationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
};
