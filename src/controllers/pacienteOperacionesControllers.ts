// src/controllers/pacienteOperacionesControllers.ts
import { Request, Response } from "express";
import { PacienteOperacionService } from "@services/PacienteOperacionesService";
import { PacienteOperacionRepository } from "@repositories/PacienteOperacionesRepositories";
import { Query } from "types/RepositoryTypes";

const pacienteOperacionRepository = new PacienteOperacionRepository();
const pacienteOperacionService = new PacienteOperacionService(pacienteOperacionRepository);

export const createPacienteOperacion = async (req: Request, res: Response) => {
  try {
    const pacienteOperacion = req.body;
    const result = await pacienteOperacionService.createPacienteOperacion(pacienteOperacion);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "Error al crear operación quirúrgica", details: error.message });
  }
};

export const findPacienteOperacion = async (req: Request, res: Response) => {
  try {
    const query = req.query as Query;
    const operaciones = await pacienteOperacionService.findPacienteOperacion(query);
    res.status(200).json(operaciones);
  } catch (error: any) {
    res.status(400).json({ error: "Error al buscar operaciones quirúrgicas", details: error.message });
  }
};

export const findPacienteOperacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const operacion = await pacienteOperacionService.findPacienteOperacionById(id);
    res.status(200).json(operacion);
  } catch (error: any) {
    res.status(404).json({ error: "Error al buscar operación quirúrgica", details: error.message });
  }
};

export const findPacienteOperacionByPaciente = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const operaciones = await pacienteOperacionService.findPacienteOperacionByPaciente(pacienteId);
    res.status(200).json(operaciones);
  } catch (error: any) {
    res.status(400).json({ error: "Error al buscar operaciones por paciente", details: error.message });
  }
};

export const updatePacienteOperacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pacienteOperacion = req.body;
    const result = await pacienteOperacionService.updatePacienteOperacion(id, pacienteOperacion);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "Error al actualizar operación quirúrgica", details: error.message });
  }
};

export const deletePacienteOperacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pacienteOperacionService.deletePacienteOperacion(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "Error al eliminar operación quirúrgica", details: error.message });
  }
};

export const softDeletePacienteOperacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pacienteOperacionService.softDeletePacienteOperacion(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: "Error al desactivar operación quirúrgica", details: error.message });
  }
};