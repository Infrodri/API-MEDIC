// src/app.ts
import "module-alias/register"; // Registra los aliases al inicio     
import app from "@server/server";
import dotenv from "dotenv";
import connectDB from "@config/mongodb"; // Renombramos la importación

dotenv.config();

const port = process.env.PORT || 4000;

// Conectar a MongoDB antes de iniciar el servidor
const startServer = async () => {
  try {
    await connectDB(); // Llama a la función de conexión
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();