import { PacienteAdiccionRepository } from "@repositories/PacienteAdiccionesRepositories";
import { PacienteAdiccionService } from "@services/PacienteAdiccionesService";
import { Request, Response } from "express";
import { IPacienteAdiccionRepository, IPacienteAdiccionService, PacienteAdiccion } from "types/PacienteAdiccionesTypes";

const pacienteAdiccionRepository: IPacienteAdiccionRepository = new PacienteAdiccionRepository();
const pacienteAdiccionService: IPacienteAdiccionService = new PacienteAdiccionService(pacienteAdiccionRepository);

export const createPacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { paciente, tipoAdiccion } = req.body;
    if (!paciente || !tipoAdiccion ) {
      return res.status(400).json({ message: "Paciente, tipo de adicción y fecha de inicio son obligatorios" });
    }

    const newPacienteAdiccion: Omit<PacienteAdiccion, keyof Document> = req.body;
    const { pacienteAdiccion, message } = await pacienteAdiccionService.createPacienteAdicciones(newPacienteAdiccion);
    res.status(201).json({ pacienteAdiccion: pacienteAdiccion.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al crear adicción del paciente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const findPacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const pacienteAdicciones = await pacienteAdiccionService.findPacienteAdicciones();
    const basicInfoList = pacienteAdicciones.map((adiccion) => adiccion.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay adicciones de pacientes encontradas" });
    res.json({ pacienteAdicciones: basicInfoList, message: "Lista de adicciones de pacientes obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener adicciones de pacientes", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const findPacienteAdiccionesById = async (req: Request, res: Response) => {
  try {
    const pacienteAdiccion = await pacienteAdiccionService.findPacienteAdiccionesById(req.params.id);
    if (!pacienteAdiccion) return res.status(404).json({ message: "Adicción del paciente no encontrada" });
    res.json({ pacienteAdiccion: pacienteAdiccion.getBasicInfo(), message: "Adicción del paciente encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener adicción del paciente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const findPacienteAdiccionesByPaciente = async (req: Request, res: Response) => {
  try {
    const pacienteAdicciones = await pacienteAdiccionService.findPacienteAdiccionesByPaciente(req.params.pacienteId);
    const basicInfoList = pacienteAdicciones.map((adiccion) => adiccion.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay adicciones para este paciente" });
    res.json({ pacienteAdicciones: basicInfoList, message: "Adicciones del paciente obtenidas con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener adicciones por paciente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const updatePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { pacienteAdiccion, message } = await pacienteAdiccionService.updatePacienteAdicciones(req.params.id, req.body);
    if (!pacienteAdiccion) return res.status(404).json({ message: "Adicción del paciente no encontrada" });
    res.json({ pacienteAdiccion: pacienteAdiccion.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar adicción del paciente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const deletePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteAdiccionService.deletePacienteAdicciones(req.params.id);
    if (!success) return res.status(404).json({ message: "Adicción del paciente no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar adicción del paciente físicamente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const softDeletePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteAdiccionService.softDeletePacienteAdicciones(req.params.id);
    if (!success) return res.status(404).json({ message: "Adicción del paciente no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar adicción del paciente lógicamente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};