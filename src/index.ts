import express from "express"
import dotenv from "dotenv"
import { booking } from "./bookings/booking.route"
import { maintenance } from "./maintenance/maintenance.route"
import { payment } from "./payment/payment.route"
import { reservation } from "./reservation/reservation.route"
import { customer } from "./customer/customer.route"
import { location } from "./location/location.route"
import { insurance } from "./insurance/insurance.route"
import { car } from "./car/car.route"
import { userRoleAuth } from "./middleware/bearAuth"
import user from "./auth/auth.router"

// Load environment variables

const initializeApp =()=>{
  dotenv.config()


const app = express()
app.use(express.json())



app.get('/', (req, res) => {
  res.send("hello")
})

app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy')
})
// import express from "express";
// import userRouter from "./routes/UserRouter";

// const app = express();
// app.use(express.json());
// app.use("/api", userRouter); // Correct usage

// app.listen(3000, () => console.log("Server running on port 3000"));


// Register routes
maintenance(app)
booking(app)
payment(app)
reservation(app)
customer(app)
location(app)
insurance(app)
car(app)
user(app)

return(app)


// Optional: database connection check example if you have db instance
/*
import db from "./drizzle/db"
async function checkDatabase() {
  try {
    await db.execute("SELECT 1")
    console.log("Database connection is healthy.")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)  // Exit process if DB connection fails
  }
}
*/

// Start server

// import authRoutes from "./auth/auth.route";

// // ... other imports and setup

// // Register auth routes
// app.use("/auth", authRoutes);




}
const app = initializeApp()
export default app

