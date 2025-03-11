// src/controllers/pacienteAdiccionesControllers.ts
import { Request, Response } from "express";
import { PacienteAdiccionService } from "@services/PacienteAdiccionesService";
import { PacienteAdiccionRepository } from "@repositories/PacienteAdiccionesRepositories";
import { Query } from "types/RepositoryTypes";

const pacienteAdiccionRepository = new PacienteAdiccionRepository();
const pacienteAdiccionService = new PacienteAdiccionService(pacienteAdiccionRepository);

export const createPacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const pacienteAdiccion = req.body;
    const result = await pacienteAdiccionService.createPacienteAdicciones(pacienteAdiccion);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "Error al crear adicción", details: error.message });
  }
};

export const findPacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const query = req.query as Query;
    const adicciones = await pacienteAdiccionService.findPacienteAdicciones(query);
    res.status(200).json(adicciones);
  } catch (error: any) {
    res.status(400).json({ error: "Error al buscar adicciones", details: error.message });
  }
};

export const findPacienteAdiccionesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adiccion = await pacienteAdiccionService.findPacienteAdiccionesById(id);
    res.status(200).json(adiccion);
  } catch (error: any) {
    res.status(404).json({ error: "Error al buscar adicción", details: error.message });
  }
};

export const findPacienteAdiccionesByPaciente = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const adicciones = await pacienteAdiccionService.findPacienteAdiccionesByPaciente(pacienteId);
    res.status(200).json(adicciones);
  } catch (error: any) {
    res.status(400).json({ error: "Error al buscar adicciones por paciente", details: error.message });
  }
};

export const updatePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pacienteAdiccion = req.body;
    const result = await pacienteAdiccionService.updatePacienteAdicciones(id, pacienteAdiccion);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "Error al actualizar adicción", details: error.message });
  }
};

export const deletePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pacienteAdiccionService.deletePacienteAdicciones(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "Error al eliminar adicción", details: error.message });
  }
};

export const softDeletePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pacienteAdiccionService.softDeletePacienteAdicciones(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "Error al desactivar adicción", details: error.message });
  }
};