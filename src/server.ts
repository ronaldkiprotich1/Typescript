import dotenv from "dotenv";
dotenv.config(); // Load environment variables before anything else

import app from "./index"; // Import the initialized Express app

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  // Optional: Add database check here, e.g., await checkDatabase();
  console.log(`Server is running on http://localhost:${port}`);
});
