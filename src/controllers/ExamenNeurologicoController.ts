import { ExamenNeurologicoRepository } from "@repositories/ExamenNeurologicoRepository";
import { ExamenNeurologicoService } from "@services/ExamenNeurologicoService";
import { Request, Response } from "express";
import { IExamenNeurologicoRepository, IExamenNeurologicoService, ExamenNeurologico } from "types/ExamenNeurologicoTypes";

const examenNeurologicoRepository: IExamenNeurologicoRepository = new ExamenNeurologicoRepository();
const examenNeurologicoService: IExamenNeurologicoService = new ExamenNeurologicoService(examenNeurologicoRepository);

export const findExamenNeurologico = async (req: Request, res: Response) => {
  try {
    const examenes = await examenNeurologicoService.findExamenNeurologico();
    if (examenes.length === 0) return res.status(404).json({ message: "No hay exámenes neurológicos encontrados." });
    res.json({ examenes, message: "Lista de exámenes neurológicos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener exámenes neurológicos", details: error });
  }
};

export const findExamenNeurologicoById = async (req: Request, res: Response) => {
  try {
    const examen = await examenNeurologicoService.findExamenNeurologicoById(req.params.id);
    if (!examen) return res.status(404).json({ message: "Examen neurológico no encontrado" });
    res.json({ examen, message: "Examen neurológico encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener examen neurológico", details: error });
  }
};

export const createExamenNeurologico = async (req: Request, res: Response) => {
  try {
    const newExamen: Omit<ExamenNeurologico, keyof Document> = req.body;
    const { examen, message } = await examenNeurologicoService.createExamenNeurologico(newExamen);
    res.status(201).json({ examen, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear examen neurológico", details: error });
  }
};

export const updateExamenNeurologico = async (req: Request, res: Response) => {
  try {
    const { examen, message } = await examenNeurologicoService.updateExamenNeurologico(req.params.id, req.body);
    if (!examen) return res.status(404).json({ message: "Examen neurológico no encontrado" });
    res.json({ examen, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar examen neurológico", details: error });
  }
};

export const softDeleteExamenNeurologico = async (req: Request, res: Response) => {
  try {
    const { success, message } = await examenNeurologicoService.softDeleteExamenNeurologico(req.params.id);
    if (!success) return res.status(404).json({ message: "Examen neurológico no encontrado" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar examen neurológico", details: error });
  }
};

export const deleteExamenNeurologico = async (req: Request, res: Response) => {
  try {
    const { success, message } = await examenNeurologicoService.deleteExamenNeurologico(req.params.id);
    if (!success) return res.status(404).json({ message: "Examen neurológico no encontrado" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar examen neurológico físicamente", details: error });
  }
};