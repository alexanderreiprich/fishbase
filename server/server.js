// server/server.js
const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3002

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}

// // Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Routes
const usersRoutes = require("./routes/users")
const inhabitantsRoutes = require("./routes/inhabitants")
const aquariumRoutes = require("./routes/aquarium")

app.use("/api/users", usersRoutes)
app.use("/api/inhabitants", inhabitantsRoutes)
app.use("/api/aquariums", aquariumRoutes)

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`)
})
