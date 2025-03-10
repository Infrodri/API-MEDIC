// src/controllers/historialMedicoController.ts
import { Request, Response } from "express";
import { HistorialMedicoRepository } from "../repositories/HistorialMedicoRepository";
import { HistorialMedicoService } from "../services/HistorialMedicoService";

const historialMedicoRepository = new HistorialMedicoRepository();
const historialMedicoService = new HistorialMedicoService(historialMedicoRepository);

export const getHistorialByPaciente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const historial = await historialMedicoService.getHistorialByPaciente(id);
    if (!historial.length) {
      return res.status(404).json({ message: "No se encontró historial médico para este paciente" });
    }
    res.json({ historial, message: "Historial médico obtenido con éxito" });
  } catch (error) {
    console.error("Error al obtener historial médico:", error);
    res.status(500).json({ error: "Error al obtener historial médico", details: error });
  }
};

export const addHistorialEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID del paciente
    const entry = req.body;
    const userId = req.currentUser?.id; // Cambiamos req.user a req.currentUser según tu middleware
    if (!userId) {
      return res.status(403).json({ message: "Acceso denegado: usuario no autenticado" });
    }

    const newEntry = await historialMedicoService.addHistorialEntry(id, entry, userId);
    res.status(201).json({ entry: newEntry, message: "Entrada de historial médico agregada con éxito" });
  } catch (error) {
    console.error("Error al agregar entrada de historial médico:", error);
    res.status(400).json({ error: "Error al agregar entrada de historial médico", details: error });
  }
};