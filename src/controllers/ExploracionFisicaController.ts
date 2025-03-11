import { ExploracionFisicaRepository } from "@repositories/ExploracionFisicaRepository";
import { ExploracionFisicaService } from "@services/ExploracionFisicaService";
import { Request, Response } from "express";
import { IExploracionFisicaRepository, IExploracionFisicaService, ExploracionFisica } from "types/ExploracionFisicaTypes";

const exploracionFisicaRepository: IExploracionFisicaRepository = new ExploracionFisicaRepository();
const exploracionFisicaService: IExploracionFisicaService = new ExploracionFisicaService(exploracionFisicaRepository);

export const findExploracionFisica = async (req: Request, res: Response) => {
  try {
    const exploraciones = await exploracionFisicaService.findExploracionFisica();
    if (exploraciones.length === 0) return res.status(404).json({ message: "No hay exploraciones físicas encontradas." });
    res.json({ exploraciones, message: "Lista de exploraciones físicas obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener exploraciones físicas", details: error });
  }
};

export const findExploracionFisicaById = async (req: Request, res: Response) => {
  try {
    const exploracion = await exploracionFisicaService.findExploracionFisicaById(req.params.id);
    if (!exploracion) return res.status(404).json({ message: "Exploración física no encontrada" });
    res.json({ exploracion, message: "Exploración física encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener exploración física", details: error });
  }
};

export const createExploracionFisica = async (req: Request, res: Response) => {
  try {
    const newExploracion: Omit<ExploracionFisica, keyof Document> = req.body;
    const { exploracion, message } = await exploracionFisicaService.createExploracionFisica(newExploracion);
    res.status(201).json({ exploracion, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear exploración física", details: error });
  }
};

export const updateExploracionFisica = async (req: Request, res: Response) => {
  try {
    const { exploracion, message } = await exploracionFisicaService.updateExploracionFisica(req.params.id, req.body);
    if (!exploracion) return res.status(404).json({ message: "Exploración física no encontrada" });
    res.json({ exploracion, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar exploración física", details: error });
  }
};

export const softDeleteExploracionFisica = async (req: Request, res: Response) => {
  try {
    const { success, message } = await exploracionFisicaService.softDeleteExploracionFisica(req.params.id);
    if (!success) return res.status(404).json({ message: "Exploración física no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar exploración física", details: error });
  }
};

export const deleteExploracionFisica = async (req: Request, res: Response) => {
  try {
    const { success, message } = await exploracionFisicaService.deleteExploracionFisica(req.params.id);
    if (!success) return res.status(404).json({ message: "Exploración física no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar exploración física físicamente", details: error });
  }
};