import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import drizzle from "../../src/Drizzle/db"; 
import { CarTable, BookingsTable,CustomerTable } from "../../src/Drizzle/schema"; 
import { eq } from "drizzle-orm";


let customerId: number;
let carId: number;
let bookingId:number;

const customerTest={
     
        firstName: "John",
         lastName: "Doe",
          email: "johnjj@example.com",
           phoneNumber: "555-1234", 
           address: "1 Elm St"

}

const testCar = {
      carModel: "Toyota Corolla",
       year: "2020-01-01", color: "Red",
        rentalRate: "50.00",
         availability: true, 
         locationID: 1 

}

beforeAll(async () => {
  // Setup: create a location
  const [cus] = await drizzle.insert(CustomerTable).values({
    ...customerTest
    
   
  }).returning();

  customerId = cus.customerID;


  const [cas] =  await drizzle.insert(CarTable).values({
    ...testCar

}).returning()
carId=cas.carID

})

afterAll(async () => {
   await drizzle.delete(BookingsTable);
  await drizzle.delete(CarTable);
  await drizzle.delete(CustomerTable);
  await db.$client.end();

 
});

describe("bOOKING CREATION", () => {
  it("should create a new booking", async () => {
    const res = await request(app).post("/booking").send({
      carID: carId, 
      customerID: customerId, 
      rentalStartDate: "2024-06-05", 
      rentalEndDate: "2024-06-10", 
      totalAmount: "250.00" 
      
    });

    expect(res.statusCode).toBe(201);
    // expect(res.body.message).toBe("booking created successfully");
    // bookingId=res.body.bookingID

  
    
  });


});