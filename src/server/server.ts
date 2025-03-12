// src/server/server.ts
import routes from "@routes/routes"; // Asegúrate de que el alias @routes esté configurado
import express, { Application } from "express";
import morgan from "morgan";
import { errorHandler } from "@middlewares/errorHandler"; // Importa el middleware

const app: Application = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", routes());
app.use(errorHandler); // Ahora está definido

export default app;