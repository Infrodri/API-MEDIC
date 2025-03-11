import { AntecedentesPersonalesRepository } from "@repositories/AntecedentesPersonalesRepository";
import { AntecedentesPersonalesService } from "@services/AntecedentesPersonalesService";
import { Request, Response } from "express";
import { IAntecedentesPersonalesRepository, IAntecedentesPersonalesService, AntecedentesPersonales } from "types/AntecedentesPersonalesTypes";

const antecedentesPersonalesRepository: IAntecedentesPersonalesRepository = new AntecedentesPersonalesRepository();
const antecedentesPersonalesService: IAntecedentesPersonalesService = new AntecedentesPersonalesService(antecedentesPersonalesRepository);

export const findAntecedentesPersonales = async (req: Request, res: Response) => {
  try {
    const antecedentes = await antecedentesPersonalesService.findAntecedentesPersonales();
    if (antecedentes.length === 0) return res.status(404).json({ message: "No hay antecedentes personales encontrados." });
    res.json({ antecedentes, message: "Lista de antecedentes personales obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener antecedentes personales", details: error });
  }
};

export const findAntecedentesPersonalesById = async (req: Request, res: Response) => {
  try {
    const antecedente = await antecedentesPersonalesService.findAntecedentesPersonalesById(req.params.id);
    if (!antecedente) return res.status(404).json({ message: "Antecedente personal no encontrado" });
    res.json({ antecedente, message: "Antecedente personal encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener antecedente personal", details: error });
  }
};

export const createAntecedentesPersonales = async (req: Request, res: Response) => {
  try {
    const newAntecedente: Omit<AntecedentesPersonales, keyof Document> = req.body;
    const { antecedente, message } = await antecedentesPersonalesService.createAntecedentesPersonales(newAntecedente);
    res.status(201).json({ antecedente, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear antecedente personal", details: error });
  }
};

export const updateAntecedentesPersonales = async (req: Request, res: Response) => {
  try {
    const { antecedente, message } = await antecedentesPersonalesService.updateAntecedentesPersonales(req.params.id, req.body);
    if (!antecedente) return res.status(404).json({ message: "Antecedente personal no encontrado" });
    res.json({ antecedente, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar antecedente personal", details: error });
  }
};

export const softDeleteAntecedentesPersonales = async (req: Request, res: Response) => {
  try {
    const { success, message } = await antecedentesPersonalesService.softDeleteAntecedentesPersonales(req.params.id);
    if (!success) return res.status(404).json({ message: "Antecedente personal no encontrado" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar antecedente personal", details: error });
  }
};

export const deleteAntecedentesPersonales = async (req: Request, res: Response) => {
  try {
    const { success, message } = await antecedentesPersonalesService.deleteAntecedentesPersonales(req.params.id);
    if (!success) return res.status(404).json({ message: "Antecedente personal no encontrado" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar antecedente personal físicamente", details: error });
  }
};