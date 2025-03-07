import { PacienteExamenesRepository } from "@repositories/PacienteExamenesRepositories";
import { PacienteExamenesService } from "@services/PacienteExamenesService";
import { Request, Response } from "express";
import { IPacienteExamenesRepository, IPacienteExamenesService, PacienteExamenes } from "types/PacienteExamenesTypes";

const pacienteExamenesRepository: IPacienteExamenesRepository = new PacienteExamenesRepository();
const pacienteExamenesService: IPacienteExamenesService = new PacienteExamenesService(pacienteExamenesRepository);

export const findPacienteExamenes = async (req: Request, res: Response) => {
  try {
    const pacientesExamenes = await pacienteExamenesService.findPacienteExamenes();
    const basicInfoList = pacientesExamenes.map((pacienteExamen) => pacienteExamen.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay relaciones paciente-exámenes encontradas." });

    res.json({ pacientesExamenes: basicInfoList, message: "Lista de relaciones paciente-exámenes obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relaciones paciente-exámenes", details: error });
  }
};

export const findPacienteExamenesById = async (req: Request, res: Response) => {
  try {
    const pacienteExamen = await pacienteExamenesService.findPacienteExamenesById(req.params.id);
    if (!pacienteExamen) return res.status(404).json({ message: "Relación paciente-examen no encontrada" });

    res.json({ pacienteExamen, message: "Relación paciente-examen encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relación paciente-examen", details: error });
  }
};

export const createPacienteExamenes = async (req: Request, res: Response) => {
  try {
    const newPacienteExamen: Omit<PacienteExamenes, keyof Document> = req.body;
    const { pacienteExamen, message } = await pacienteExamenesService.createPacienteExamenes(newPacienteExamen);

    res.status(201).json({ pacienteExamen, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear relación paciente-examen", details: error });
  }
};

export const updatePacienteExamenes = async (req: Request, res: Response) => {
  try {
    const { pacienteExamen, message } = await pacienteExamenesService.updatePacienteExamenes(req.params.id, req.body);
    if (!pacienteExamen) return res.status(404).json({ message: "Relación paciente-examen no encontrada" });

    res.json({ pacienteExamen, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar relación paciente-examen", details: error });
  }
};

export const softDeletePacienteExamenes = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteExamenesService.softDeletePacienteExamenes(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación paciente-examen no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación paciente-examen", details: error });
  }
};

export const deletePacienteExamenes = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteExamenesService.deletePacienteExamenes(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación paciente-examen no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación paciente-examen físicamente", details: error });
  }
};