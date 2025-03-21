// src/routes/dashboardRoutes.ts
import { Router } from "express";
import { getPermissons, verifyToken } from "@middlewares/auth";
import { getConsultasHoy, getConsultasPorMes, getConsultasPorMesPorEspecialidad, getDashboardStats, getMedicosList, getPacientesEnEspera } from "@controllers/dashboardControllers";


const router = Router();

// Rutas actualizadas con prefijo /
router.get("/stats", verifyToken, getPermissons, getDashboardStats);
router.get("/consultas-por-mes-especialidad", verifyToken, getPermissons, getConsultasPorMesPorEspecialidad);
router.get("/medicos", verifyToken, getPermissons, getMedicosList);
router.get("/consultas-hoy", verifyToken, getPermissons, getConsultasHoy);
router.get("/pacientes-en-espera", verifyToken, getPermissons, getPacientesEnEspera);
router.get("/consultas-por-mes", verifyToken, getPermissons, getConsultasPorMes); // Nueva ruta añadida
// Ruta placeholder para alertas (sin cambios en el path, pero con prefijo /)
router.get("/alertas", verifyToken, (req, res) => {
  res.status(501).json({
    success: false,
    message: "Ruta de alertas no implementada aún",
  });
});

export default router;