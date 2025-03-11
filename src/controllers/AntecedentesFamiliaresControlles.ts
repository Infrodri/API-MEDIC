import { AntecedentesFamiliaresRepository } from "@repositories/AntecedentesFamiliaresRepository";
import { AntecedentesFamiliaresService } from "@services/AntecedentesFamiliaresService";
import { Request, Response } from "express";
import { IAntecedentesFamiliaresRepository, IAntecedentesFamiliaresService, AntecedentesFamiliares } from "types/AntecedentesFamiliaresTypes";

const antecedentesFamiliaresRepository: IAntecedentesFamiliaresRepository = new AntecedentesFamiliaresRepository();
const antecedentesFamiliaresService: IAntecedentesFamiliaresService = new AntecedentesFamiliaresService(antecedentesFamiliaresRepository);

export const findAntecedentesFamiliares = async (req: Request, res: Response) => {
  try {
    const antecedentes = await antecedentesFamiliaresService.findAntecedentesFamiliares();
    if (antecedentes.length === 0) return res.status(404).json({ message: "No hay antecedentes familiares encontrados." });

    res.json({ antecedentes, message: "Lista de antecedentes familiares obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener antecedentes familiares", details: error });
  }
};

export const findAntecedentesFamiliaresById = async (req: Request, res: Response) => {
  try {
    const antecedente = await antecedentesFamiliaresService.findAntecedentesFamiliaresById(req.params.id);
    if (!antecedente) return res.status(404).json({ message: "Antecedente familiar no encontrado" });

    res.json({ antecedente, message: "Antecedente familiar encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener antecedente familiar", details: error });
  }
};

export const createAntecedentesFamiliares = async (req: Request, res: Response) => {
  try {
    const newAntecedente: Omit<AntecedentesFamiliares, keyof Document> = req.body;
    const { antecedente, message } = await antecedentesFamiliaresService.createAntecedentesFamiliares(newAntecedente);

    res.status(201).json({ antecedente, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear antecedente familiar", details: error });
  }
};

export const updateAntecedentesFamiliares = async (req: Request, res: Response) => {
  try {
    const { antecedente, message } = await antecedentesFamiliaresService.updateAntecedentesFamiliares(req.params.id, req.body);
    if (!antecedente) return res.status(404).json({ message: "Antecedente familiar no encontrado" });

    res.json({ antecedente, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar antecedente familiar", details: error });
  }
};

export const softDeleteAntecedentesFamiliares = async (req: Request, res: Response) => {
  try {
    const { success, message } = await antecedentesFamiliaresService.softDeleteAntecedentesFamiliares(req.params.id);
    if (!success) return res.status(404).json({ message: "Antecedente familiar no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar antecedente familiar", details: error });
  }
};

export const deleteAntecedentesFamiliares = async (req: Request, res: Response) => {
  try {
    const { success, message } = await antecedentesFamiliaresService.deleteAntecedentesFamiliares(req.params.id);
    if (!success) return res.status(404).json({ message: "Antecedente familiar no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar antecedente familiar físicamente", details: error });
  }
};