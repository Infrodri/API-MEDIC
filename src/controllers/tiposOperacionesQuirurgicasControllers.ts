import { TiposOperacionesQuirurgicasRepository } from "@repositories/TiposOperacionesQuirurgicasRepositories";
import { TiposOperacionesQuirurgicasService } from "@services/TiposOperacionesQuirurgicasService";
import { Request, Response } from "express";
import { ITiposOperacionesQuirurgicasRepository, ITiposOperacionesQuirurgicasService, TiposOperacionesQuirurgicas } from "types/TiposOperacionesQuirurgicasTypes";

const tiposOperacionesQuirurgicasRepository: ITiposOperacionesQuirurgicasRepository = new TiposOperacionesQuirurgicasRepository();
const tiposOperacionesQuirurgicasService: ITiposOperacionesQuirurgicasService = new TiposOperacionesQuirurgicasService(tiposOperacionesQuirurgicasRepository);

export const findTiposOperacionesQuirurgicas = async (req: Request, res: Response) => {
  try {
    const tipos = await tiposOperacionesQuirurgicasService.findTiposOperacionesQuirurgicas();
    const basicInfoList = tipos.map((tipos) => tipos.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay tipos de operaciones quirúrgicas encontrados." });

    res.json({ tipos: basicInfoList, message: "Lista de tipos de operaciones quirúrgicas obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener tipos de operaciones quirúrgicas", details: error });
  }
};

export const findTiposOperacionesQuirurgicasById = async (req: Request, res: Response) => {
  try {
    const tipos = await tiposOperacionesQuirurgicasService.findTiposOperacionesQuirurgicasById(req.params.id);
    if (!tipos) return res.status(404).json({ message: "Tipo de operación quirúrgica no encontrado" });

    res.json({ tipos, message: "Tipo de operación quirúrgica encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener tipo de operación quirúrgica", details: error });
  }
};

export const createTiposOperacionesQuirurgicas = async (req: Request, res: Response) => {
  try {
    const newTipos: Omit<TiposOperacionesQuirurgicas, keyof Document> = req.body;
    const { tipos, message } = await tiposOperacionesQuirurgicasService.createTiposOperacionesQuirurgicas(newTipos);

    res.status(201).json({ tipos, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear tipo de operación quirúrgica", details: error });
  }
};

export const updateTiposOperacionesQuirurgicas = async (req: Request, res: Response) => {
  try {
    const { tipos, message } = await tiposOperacionesQuirurgicasService.updateTiposOperacionesQuirurgicas(req.params.id, req.body);
    if (!tipos) return res.status(404).json({ message: "Tipo de operación quirúrgica no encontrado" });

    res.json({ tipos, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar tipo de operación quirúrgica", details: error });
  }
};

export const softDeleteTiposOperacionesQuirurgicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await tiposOperacionesQuirurgicasService.softDeleteTiposOperacionesQuirurgicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Tipo de operación quirúrgica no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar tipo de operación quirúrgica", details: error });
  }
};

export const deleteTiposOperacionesQuirurgicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await tiposOperacionesQuirurgicasService.deleteTiposOperacionesQuirurgicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Tipo de operación quirúrgica no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar tipo de operación quirúrgica físicamente", details: error });
  }
};