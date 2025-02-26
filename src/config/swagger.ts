import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API-USERS",
      version: "1.0.0",
      description: "API para la gestión de usuarios, pacientes y consultas médicas en una clínica",
    },
    servers: [{ url: "http://localhost:4000/api/v1" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["src/routes/*.ts", "src/controllers/*.ts"], // Ajusta según tus rutas y controladores
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};