// src/routes/fichasMedicasRoutes.ts
import { Router } from "express";
import {
  getFichaByPaciente,
  createFicha,
  updateFicha,
  softDeleteFicha,
  addAntecedentesPersonales,
  addAntecedentesFamiliares,
  addOperacionQuirurgica,
  addGinecologiaObstetrica,
  addAdiccion,
  addExploracionFisica,
  addExamenNeurologico,
  addOrganosSentidos,
  addConsultaMedica,
  generateReporte,
} from "../controllers/fichasMedicasControllers";
import { verifyToken, getPermissons } from "../middlewares/auth";

const router = Router();

router.post("/", verifyToken, getPermissons, createFicha); // Esto maneja POST /api/v1/fichas
router.get("/:pacienteId", verifyToken, getPermissons, getFichaByPaciente);
router.put("/:id", verifyToken, getPermissons, updateFicha);
router.delete("/:id/soft", verifyToken, getPermissons, softDeleteFicha);
router.post("/:pacienteId/antecedentes-personales", verifyToken, getPermissons, addAntecedentesPersonales);
router.post("/:pacienteId/antecedentes-familiares", verifyToken, getPermissons, addAntecedentesFamiliares);
router.post("/:pacienteId/operaciones-quirurgicas", verifyToken, getPermissons, addOperacionQuirurgica);
router.post("/:pacienteId/ginecologia-obstetrica", verifyToken, getPermissons, addGinecologiaObstetrica);
router.post("/:pacienteId/adicciones", verifyToken, getPermissons, addAdiccion);
router.post("/:pacienteId/exploracion-fisica", verifyToken, getPermissons, addExploracionFisica);
router.post("/:pacienteId/examen-neurologico", verifyToken, getPermissons, addExamenNeurologico);
router.post("/:pacienteId/organos-sentidos", verifyToken, getPermissons, addOrganosSentidos);
router.post("/:id/consulta-medica", verifyToken, getPermissons, addConsultaMedica);
router.get("/:id/reporte", verifyToken, getPermissons, generateReporte);

export { router };