// src/controllers/pacienteExamenControllers.ts
import { PacienteExamenRepository } from "@repositories/PacienteExamenesRepositories";
import { PacienteExamenService } from "@services/PacienteExamenesService";
import { Request, Response } from "express";
import { IPacienteExamenRepository, IPacienteExamenService, PacienteExamen } from "types/PacienteExamenesTypes";

const pacienteExamenRepository: IPacienteExamenRepository = new PacienteExamenRepository();
const pacienteExamenService: IPacienteExamenService = new PacienteExamenService(pacienteExamenRepository);

export const createPacienteExamen = async (req: Request, res: Response) => {
  try {
    const newPacienteExamen: Omit<PacienteExamen, keyof Document> = req.body;
    const { pacienteExamen, message } = await pacienteExamenService.createPacienteExamen(newPacienteExamen);
    res.status(201).json({ pacienteExamen: pacienteExamen.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear examen del paciente", details: error });
  }
};

export const findPacienteExamen = async (req: Request, res: Response) => {
  try {
    const pacienteExamenes = await pacienteExamenService.findPacienteExamen();
    const basicInfoList = pacienteExamenes.map((examen) => examen.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay exámenes de pacientes encontrados." });
    res.json({ pacienteExamenes: basicInfoList, message: "Lista de exámenes de pacientes obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener exámenes de pacientes", details: error });
  }
};

export const findPacienteExamenById = async (req: Request, res: Response) => {
  try {
    const pacienteExamen = await pacienteExamenService.findPacienteExamenById(req.params.id);
    if (!pacienteExamen) return res.status(404).json({ message: "Examen del paciente no encontrado" });
    res.json({ pacienteExamen: pacienteExamen.getBasicInfo(), message: "Examen del paciente encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener examen del paciente", details: error });
  }
};

export const findPacienteExamenByPaciente = async (req: Request, res: Response) => {
  try {
    const pacienteExamenes = await pacienteExamenService.findPacienteExamenByPaciente(req.params.pacienteId);
    const basicInfoList = pacienteExamenes.map((examen) => examen.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay exámenes para este paciente" });
    res.json({ pacienteExamenes: basicInfoList, message: "Exámenes del paciente obtenidos con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener exámenes por paciente", details: error });
  }
};

export const updatePacienteExamen = async (req: Request, res: Response) => {
  try {
    const { pacienteExamen, message } = await pacienteExamenService.updatePacienteExamen(req.params.id, req.body);
    if (!pacienteExamen) return res.status(404).json({ message: "Examen del paciente no encontrado" });
    res.json({ pacienteExamen: pacienteExamen.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar examen del paciente", details: error });
  }
};

export const deletePacienteExamen = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteExamenService.deletePacienteExamen(req.params.id);
    if (!success) return res.status(404).json({ message: "Examen del paciente no encontrado" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar examen del paciente físicamente", details: error });
  }
};

export const softDeletePacienteExamen = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteExamenService.softDeletePacienteExamen(req.params.id);
    if (!success) return res.status(404).json({ message: "Examen del paciente no encontrado" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar examen del paciente", details: error });
  }
};