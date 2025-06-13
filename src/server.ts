import app from "."
import dotenv from "dotenv"

  dotenv.config()



  const port = process.env.PORT || 5000
app.listen(port, async () => {
  // await checkDatabase()  // uncomment if you add DB check
  console.log(`server is running on http://localhost:${port}`)
})