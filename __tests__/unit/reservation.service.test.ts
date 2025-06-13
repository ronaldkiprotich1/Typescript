import { eq } from "drizzle-orm";
import db from "../../src/Drizzle/db";
import { ReservationTable, TIReservation } from "../../src/Drizzle/schema";
import {
  createReservationService,
  getReservationService,
  getAllReservationsService,
  updateReservationService,
  deleteReservationService,
} from "../../src/reservation/reservation.service";

jest.mock("../src/Drizzle/db", () => ({
  __esModule: true,
  default: {
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      ReservationTable: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
  },
}));

jest.mock("drizzle-orm", () => {
  const actual = jest.requireActual("drizzle-orm");
  return {
    ...actual,
    eq: jest.fn().mockReturnValue("MOCK_WHERE_CLAUSE"),
  };
});

const mockDb = db as jest.Mocked<typeof db>;

describe("Reservation Service CRUD Operations", () => {
  const mockReservation: TIReservation = {
    reservationID: 1,
    customerID: 101,
    carID: 201,
    reservationDate: "2024-01-01T00:00:00.000Z",
    pickupDate: "2024-01-05T00:00:00.000Z",
    returnDate: "2024-01-10T00:00:00.000Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createReservationService", () => {
    it("should create a new reservation", async () => {
      (mockDb.insert as jest.Mock).mockImplementation(() => ({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockReservation]),
        }),
      }));

      const result = await createReservationService(mockReservation);

      expect(mockDb.insert).toHaveBeenCalledWith(ReservationTable);
      expect(result).toEqual(mockReservation);
    });

    it("should throw an error if insert fails", async () => {
      (mockDb.insert as jest.Mock).mockImplementation(() => {
        throw new Error("Insert failed");
      });

      await expect(createReservationService(mockReservation)).rejects.toThrow("Insert failed");
    });

    it("should handle invalid reservation date format", async () => {
      const invalidReservation = { ...mockReservation, reservationDate: "invalid-date" };
      // Assuming your service has validation, otherwise this test will fail
      await expect(createReservationService(invalidReservation)).rejects.toThrow();
    });
  });

  describe("getReservationService", () => {
    it("should retrieve a reservation by ID", async () => {
      (mockDb.query.ReservationTable.findFirst as jest.Mock).mockImplementation(() => {
        return Promise.resolve(mockReservation);
      });

      const result = await getReservationService(1);

      expect(eq).toHaveBeenCalledWith(ReservationTable.reservationID, 1);
      expect(mockDb.query.ReservationTable.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: {
            reservationID: true,
            customerID: true,
            carID: true,
            reservationDate: true,
            pickupDate: true,
            returnDate: true,
          },
          where: "MOCK_WHERE_CLAUSE",
        })
      );
      expect(result).toEqual(mockReservation);
    });

    it("should return undefined when reservation is not found", async () => {
      (mockDb.query.ReservationTable.findFirst as jest.Mock).mockResolvedValue(undefined);

      const result = await getReservationService(999);
      expect(result).toBeUndefined();
    });

    it("should throw an error if query fails", async () => {
      (mockDb.query.ReservationTable.findFirst as jest.Mock).mockImplementation(() => {
        throw new Error("Query failed");
      });

      await expect(getReservationService(1)).rejects.toThrow("Query failed");
    });
  });

  describe("getAllReservationsService", () => {
    it("should retrieve all reservations", async () => {
      (mockDb.query.ReservationTable.findMany as jest.Mock).mockResolvedValue([mockReservation]);

      const result = await getAllReservationsService();

      expect(mockDb.query.ReservationTable.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: {
            reservationID: true,
            customerID: true,
            carID: true,
            reservationDate: true,
            pickupDate: true,
            returnDate: true,
          },
        })
      );
      expect(result).toEqual([mockReservation]);
    });

    it("should throw an error if query fails", async () => {
      (mockDb.query.ReservationTable.findMany as jest.Mock).mockImplementation(() => {
        throw new Error("Query failed");
      });

      await expect(getAllReservationsService()).rejects.toThrow("Query failed");
    });
  });

  describe("updateReservationService", () => {
    it("should update a reservation", async () => {
      const updateData = { pickupDate: "2024-01-06T00:00:00.000Z" };

      (mockDb.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{ ...mockReservation, ...updateData }]),
          }),
        }),
      }));

      const result = await updateReservationService(1, updateData);

      expect(mockDb.update).toHaveBeenCalledWith(ReservationTable);
      expect(result).toEqual({ ...mockReservation, ...updateData });
    });

    it("should throw an error if update fails", async () => {
      (mockDb.update as jest.Mock).mockImplementation(() => {
        throw new Error("Update failed");
      });

      await expect(updateReservationService(1, { pickupDate: "2024-01-06T00:00:00.000Z" })).rejects.toThrow("Update failed");
    });
  });

  describe("deleteReservationService", () => {
    it("should delete a reservation and return the deleted reservation", async () => {
      (mockDb.delete as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockReservation]),
        }),
      }));

      const result = await deleteReservationService(1);

      expect(mockDb.delete).toHaveBeenCalledWith(ReservationTable);
      expect(result).toEqual(mockReservation);
    });

    it("should return undefined when no reservation is deleted", async () => {
      (mockDb.delete as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      }));

      const result = await deleteReservationService(999);
      expect(result).toBeUndefined();
    });

    it("should throw an error if delete fails", async () => {
      (mockDb.delete as jest.Mock).mockImplementation(() => {
        throw new Error("Delete failed");
      });

      await expect(deleteReservationService(1)).rejects.toThrow("Delete failed");
    });
  });
});
