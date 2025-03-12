// src/routes/dashboardRoutes.ts
import { Router } from "express";
import {
  getDashboardStats,
  getConsultasHoy,
  getMedicosActivosHoy,
  getAlertas,
  getUserDashboardStats,
  getCriticalResources,
  getFilteredDoctors, // Añadido
  getDoctorsPageCount, // Añadido
} from "@controllers/dashboardControllers";
import { verifyToken, getPermissons } from "@middlewares/auth";

const router = Router();

router.get("/stats", verifyToken, getPermissons, getDashboardStats);
router.get("/consultas/hoy", verifyToken, getPermissons, getConsultasHoy);
router.get("/medicos/activos", verifyToken, getPermissons, getMedicosActivosHoy);
router.get("/alertas", verifyToken, getPermissons, getAlertas);
router.get("/user/stats", verifyToken, getPermissons, getUserDashboardStats);
router.get("/resources/critical", verifyToken, getPermissons, getCriticalResources);
router.get("/medicos/paginate", verifyToken, getPermissons, getFilteredDoctors); // Nueva ruta
router.get("/medicos/page-count", verifyToken, getPermissons, getDoctorsPageCount); // Nueva ruta


export default router;