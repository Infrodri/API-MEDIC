import { FichasMedicasRepository } from "@repositories/FichasMedicasRepositories";
import { FichasMedicasService } from "@services/FichasMedicasService";
import { Request, Response } from "express";
import { IFichasMedicasRepository, IFichasMedicasService, FichasMedicas } from "types/FichasMedicasTypes";

const fichasMedicasRepository: IFichasMedicasRepository = new FichasMedicasRepository();
const fichasMedicasService: IFichasMedicasService = new FichasMedicasService(fichasMedicasRepository);

export const findFichasMedicas = async (req: Request, res: Response) => {
  try {
    const fichas = await fichasMedicasService.findFichasMedicas();
    const basicInfoList = fichas.map((ficha) => ficha.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay fichas médicas encontradas." });

    res.json({ fichas: basicInfoList, message: "Lista de fichas médicas obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener fichas médicas", details: error });
  }
};

export const findFichasMedicasById = async (req: Request, res: Response) => {
  try {
    const ficha = await fichasMedicasService.findFichasMedicasById(req.params.id);
    if (!ficha) return res.status(404).json({ message: "Ficha médica no encontrada" });

    res.json({ ficha, message: "Ficha médica encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener ficha médica", details: error });
  }
};

export const createFichasMedicas = async (req: Request, res: Response) => {
  try {
    const newFicha: Omit<FichasMedicas, keyof Document> = req.body;
    const { ficha, message } = await fichasMedicasService.createFichasMedicas(newFicha);

    res.status(201).json({ ficha, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear ficha médica", details: error });
  }
};

export const updateFichasMedicas = async (req: Request, res: Response) => {
  try {
    const { ficha, message } = await fichasMedicasService.updateFichasMedicas(req.params.id, req.body);
    if (!ficha) return res.status(404).json({ message: "Ficha médica no encontrada" });

    res.json({ ficha, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar ficha médica", details: error });
  }
};

export const softDeleteFichasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await fichasMedicasService.softDeleteFichasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Ficha médica no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar ficha médica", details: error });
  }
};

export const deleteFichasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await fichasMedicasService.deleteFichasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Ficha médica no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar ficha médica físicamente", details: error });
  }
};