import { PacienteAdiccionesRepository } from "@repositories/PacienteAdiccionesRepositories";
import { PacienteAdiccionesService } from "@services/PacienteAdiccionesService";
import { Request, Response } from "express";
import { IPacienteAdiccionesRepository, IPacienteAdiccionesService, PacienteAdicciones } from "types/PacienteAdiccionesTypes";

const pacienteAdiccionesRepository: IPacienteAdiccionesRepository = new PacienteAdiccionesRepository();
const pacienteAdiccionesService: IPacienteAdiccionesService = new PacienteAdiccionesService(pacienteAdiccionesRepository);

export const findPacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const pacientesAdicciones = await pacienteAdiccionesService.findPacienteAdicciones();
    const basicInfoList = pacientesAdicciones.map((pacienteAdiccion) => pacienteAdiccion.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay relaciones paciente-adicciones encontradas." });

    res.json({ pacientesAdicciones: basicInfoList, message: "Lista de relaciones paciente-adicciones obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relaciones paciente-adicciones", details: error });
  }
};

export const findPacienteAdiccionesById = async (req: Request, res: Response) => {
  try {
    const pacienteAdiccion = await pacienteAdiccionesService.findPacienteAdiccionesById(req.params.id);
    if (!pacienteAdiccion) return res.status(404).json({ message: "Relación paciente-adicción no encontrada" });

    res.json({ pacienteAdiccion, message: "Relación paciente-adicción encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relación paciente-adicción", details: error });
  }
};

export const createPacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const newPacienteAdiccion: Omit<PacienteAdicciones, keyof Document> = req.body;
    const { pacienteAdiccion, message } = await pacienteAdiccionesService.createPacienteAdicciones(newPacienteAdiccion);

    res.status(201).json({ pacienteAdiccion, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear relación paciente-adicción", details: error });
  }
};

export const updatePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { pacienteAdiccion, message } = await pacienteAdiccionesService.updatePacienteAdicciones(req.params.id, req.body);
    if (!pacienteAdiccion) return res.status(404).json({ message: "Relación paciente-adicción no encontrada" });

    res.json({ pacienteAdiccion, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar relación paciente-adicción", details: error });
  }
};

export const softDeletePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteAdiccionesService.softDeletePacienteAdicciones(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación paciente-adicción no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación paciente-adicción", details: error });
  }
};

export const deletePacienteAdicciones = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteAdiccionesService.deletePacienteAdicciones(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación paciente-adicción no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación paciente-adicción físicamente", details: error });
  }
};