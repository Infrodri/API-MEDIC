import { PacienteOperacionesRepository } from "@repositories/PacienteOperacionesRepositories";
import { PacienteOperacionesService } from "@services/PacienteOperacionesService";
import { Request, Response } from "express";
import { IPacienteOperacionesRepository, IPacienteOperacionesService, PacienteOperaciones } from "types/PacienteOperacionesTypes";

const pacienteOperacionesRepository: IPacienteOperacionesRepository = new PacienteOperacionesRepository();
const pacienteOperacionesService: IPacienteOperacionesService = new PacienteOperacionesService(pacienteOperacionesRepository);

export const findPacienteOperaciones = async (req: Request, res: Response) => {
  try {
    const pacientesOps = await pacienteOperacionesService.findPacienteOperaciones();
    const basicInfoList = pacientesOps.map((pacienteOp) => pacienteOp.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay relaciones paciente-operaciones encontradas." });

    res.json({ pacientesOps: basicInfoList, message: "Lista de relaciones paciente-operaciones obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relaciones paciente-operaciones", details: error });
  }
};

export const findPacienteOperacionesById = async (req: Request, res: Response) => {
  try {
    const pacienteOp = await pacienteOperacionesService.findPacienteOperacionesById(req.params.id);
    if (!pacienteOp) return res.status(404).json({ message: "Relación paciente-operación no encontrada" });

    res.json({ pacienteOp, message: "Relación paciente-operación encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relación paciente-operación", details: error });
  }
};

export const createPacienteOperaciones = async (req: Request, res: Response) => {
  try {
    const newPacienteOp: Omit<PacienteOperaciones, keyof Document> = req.body;
    const { pacienteOp, message } = await pacienteOperacionesService.createPacienteOperaciones(newPacienteOp);

    res.status(201).json({ pacienteOp, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear relación paciente-operación", details: error });
  }
};

export const updatePacienteOperaciones = async (req: Request, res: Response) => {
  try {
    const { pacienteOp, message } = await pacienteOperacionesService.updatePacienteOperaciones(req.params.id, req.body);
    if (!pacienteOp) return res.status(404).json({ message: "Relación paciente-operación no encontrada" });

    res.json({ pacienteOp, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar relación paciente-operación", details: error });
  }
};

export const softDeletePacienteOperaciones = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteOperacionesService.softDeletePacienteOperaciones(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación paciente-operación no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación paciente-operación", details: error });
  }
};

export const deletePacienteOperaciones = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteOperacionesService.deletePacienteOperaciones(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación paciente-operación no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación paciente-operación físicamente", details: error });
  }
};