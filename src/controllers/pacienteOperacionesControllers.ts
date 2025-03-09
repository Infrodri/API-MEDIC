// src/controllers/pacienteOperacionesControllers.ts
import { PacienteOperacionRepository } from "@repositories/PacienteOperacionesRepositories";
import { PacienteOperacionService } from "@services/PacienteOperacionesService";
import { Request, Response } from "express";
import { IPacienteOperacionRepository, IPacienteOperacionService, PacienteOperacion } from "types/PacienteOperacionesTypes";

const pacienteOperacionRepository: IPacienteOperacionRepository = new PacienteOperacionRepository();
const pacienteOperacionService: IPacienteOperacionService = new PacienteOperacionService(pacienteOperacionRepository);

export const createPacienteOperacion = async (req: Request, res: Response) => {
  try {
    const newPacienteOperacion: Omit<PacienteOperacion, keyof Document> = req.body;
    const { pacienteOperacion, message } = await pacienteOperacionService.createPacienteOperacion(newPacienteOperacion);
    res.status(201).json({ pacienteOperacion, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear operación del paciente", details: error });
  }
};

export const findPacienteOperacion = async (req: Request, res: Response) => {
  try {
    const pacienteOperacion = await pacienteOperacionService.findPacienteOperacion();
    const basicInfoList = pacienteOperacion.map((operacion) => operacion.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay operaciones de pacientes encontradas." });
    res.json({ pacienteOperacion: basicInfoList, message: "Lista de operaciones de pacientes obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener operaciones de pacientes", details: error });
  }
};

export const findPacienteOperacionById = async (req: Request, res: Response) => {
  try {
    const pacienteOperacion = await pacienteOperacionService.findPacienteOperacionById(req.params.id);
    if (!pacienteOperacion) return res.status(404).json({ message: "Operación del paciente no encontrada" });
    res.json({ pacienteOperacion, message: "Operación del paciente encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener operación del paciente", details: error });
  }
};

export const findPacienteOperacionByPaciente = async (req: Request, res: Response) => {
  try {
    const pacienteOperacion = await pacienteOperacionService.findPacienteOperacionByPaciente(req.params.pacienteId);
    const basicInfoList = pacienteOperacion.map((operacion) => operacion.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay operaciones para este paciente" });
    res.json({ pacienteOperacion: basicInfoList, message: "Operaciones del paciente obtenidas con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener operaciones por paciente", details: error });
  }
};

export const updatePacienteOperacion = async (req: Request, res: Response) => {
  try {
    const { pacienteOperacion, message } = await pacienteOperacionService.updatePacienteOperacion(req.params.id, req.body);
    if (!pacienteOperacion) return res.status(404).json({ message: "Operación del paciente no encontrada" });
    res.json({ pacienteOperacion, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar operación del paciente", details: error });
  }
};

export const deletePacienteOperacion = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteOperacionService.deletePacienteOperacion(req.params.id);
    if (!success) return res.status(404).json({ message: "Operación del paciente no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar operación del paciente físicamente", details: error });
  }
};

export const softDeletePacienteOperacion = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteOperacionService.softDeletePacienteOperacion(req.params.id);
    if (!success) return res.status(404).json({ message: "Operación del paciente no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar operación del paciente", details: error });
  }
};