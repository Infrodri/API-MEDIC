// src/controllers/fichasMedicasControllers.ts
import { FichasMedicasRepository } from "@repositories/FichasMedicasRepositories";
import { FichasMedicasService } from "@services/FichasMedicasService";
import { Request, Response } from "express";
import { IFichasMedicasRepository, IFichasMedicasService, FichasMedicas } from "types/FichasMedicasTypes";

const fichasMedicasRepository: IFichasMedicasRepository = new FichasMedicasRepository();
const fichasMedicasService: IFichasMedicasService = new FichasMedicasService(fichasMedicasRepository);

export const createFichaMedica = async (req: Request, res: Response) => {
  try {
    const { paciente, medico, especialidad, diagnostico } = req.body;
    if (!paciente || !medico || !especialidad || !diagnostico) {
      return res.status(400).json({ message: "Paciente, médico, especialidad y diagnóstico son obligatorios" });
    }

    const newFicha: Omit<FichasMedicas, keyof Document> = req.body;
    const { ficha, message } = await fichasMedicasService.createFichaMedica(newFicha);
    res.status(201).json({ ficha: ficha.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al crear ficha médica", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const findFichasMedicas = async (req: Request, res: Response) => {
  try {
    const fichas = await fichasMedicasService.findFichasMedicas();
    const basicInfoList = fichas.map((ficha) => ficha.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay fichas médicas encontradas" });
    res.json({ fichas: basicInfoList, message: "Lista de fichas médicas obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener fichas médicas", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const findFichaMedicaById = async (req: Request, res: Response) => {
  try {
    const ficha = await fichasMedicasService.findFichaMedicaById(req.params.id);
    if (!ficha) return res.status(404).json({ message: "Ficha médica no encontrada" });
    res.json({ ficha: ficha.getBasicInfo(), message: "Ficha médica encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener ficha médica", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const findFichasMedicasByPaciente = async (req: Request, res: Response) => {
  try {
    const fichas = await fichasMedicasService.findFichasMedicasByPaciente(req.params.pacienteId);
    const basicInfoList = fichas.map((ficha) => ficha.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay fichas médicas para este paciente" });
    res.json({ fichas: basicInfoList, message: "Fichas médicas del paciente obtenidas con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener fichas médicas por paciente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const updateFichaMedica = async (req: Request, res: Response) => {
  try {
    const { ficha, message } = await fichasMedicasService.updateFichaMedica(req.params.id, req.body);
    if (!ficha) return res.status(404).json({ message: "Ficha médica no encontrada" });
    res.json({ ficha: ficha.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar ficha médica", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const deleteFichaMedica = async (req: Request, res: Response) => {
  try {
    const { success, message } = await fichasMedicasService.deleteFichaMedica(req.params.id);
    if (!success) return res.status(404).json({ message: "Ficha médica no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar ficha médica físicamente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const softDeleteFichaMedica = async (req: Request, res: Response) => {
  try {
    const { success, message } = await fichasMedicasService.softDeleteFichaMedica(req.params.id);
    if (!success) return res.status(404).json({ message: "Ficha médica no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar ficha médica lógicamente", details: error instanceof Error ? error.message : "Unknown error" });
  }
};