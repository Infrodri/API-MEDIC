import { Router } from "express";
import { verifyToken } from "@middlewares/auth";
import {
  getDashboardStats,
  getConsultasHoy,
  getMedicosActivosHoy,
  getPacientes, // Nueva función del controlador
} from "@controllers/dashboardControllers";

const router = Router();

// Estadísticas del dashboard
router.get("/stats", verifyToken, getDashboardStats);

// Consultas de hoy con paginación
router.get("/consultas/hoy", verifyToken, getConsultasHoy);

// Médicos activos
router.get("/medicos/activos", verifyToken, getMedicosActivosHoy);

// Pacientes con paginación
router.get("/pacientes", verifyToken, getPacientes);

// Ruta placeholder para alertas (puedes implementarla después)
router.get("/alertas", verifyToken, (req, res) => {
  res.status(501).json({
    success: false,
    message: "Ruta de alertas no implementada aún",
  });
});

export default router;