import { TiposAdiccionesRepository } from "@repositories/TiposAdiccionesRepositories";
import { TiposAdiccionesService } from "@services/TiposAdiccionesService";
import { Request, Response } from "express";
import { ITiposAdiccionRepository, ITiposAdiccionService, TiposAdiccion } from "types/TiposAdiccionesTypes";

const tiposAdiccionesRepository: ITiposAdiccionRepository = new TiposAdiccionesRepository();
const tiposAdiccionesService: ITiposAdiccionService = new TiposAdiccionesService(tiposAdiccionesRepository);

export const findTiposAdicciones = async (req: Request, res: Response) => {
  try {
    const tiposAdicciones = await tiposAdiccionesService.findTiposAdicciones();
    const basicInfoList = tiposAdicciones.map((tiposAdiccion) => tiposAdiccion.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay tipos de adicciones encontrados." });

    res.json({ tiposAdicciones: basicInfoList, message: "Lista de tipos de adicciones obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener tipos de adicciones", details: error });
  }
};

export const findTiposAdiccionById = async (req: Request, res: Response) => {
  try {
    const tiposAdiccion = await tiposAdiccionesService.findTiposAdiccionById(req.params.id);
    if (!tiposAdiccion) return res.status(404).json({ message: "Tipo de adicción no encontrado" });

    res.json({ tiposAdiccion, message: "Tipo de adicción encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener tipo de adicción", details: error });
  }
};

export const createTiposAdiccion = async (req: Request, res: Response) => {
  try {
    const newTiposAdiccion: Omit<TiposAdiccion, keyof Document> = req.body;
    const { tiposAdiccion, message } = await tiposAdiccionesService.createTiposAdiccion(newTiposAdiccion);

    res.status(201).json({ tiposAdiccion, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear tipo de adicción", details: error });
  }
};

export const updateTiposAdiccion = async (req: Request, res: Response) => {
  try {
    const { tiposAdiccion, message } = await tiposAdiccionesService.updateTiposAdiccion(req.params.id, req.body);
    if (!tiposAdiccion) return res.status(404).json({ message: "Tipo de adicción no encontrado" });

    res.json({ tiposAdiccion, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar tipo de adicción", details: error });
  }
};

export const softDeleteTiposAdiccion = async (req: Request, res: Response) => {
  try {
    const { success, message } = await tiposAdiccionesService.softDeleteTiposAdiccion(req.params.id);
    if (!success) return res.status(404).json({ message: "Tipo de adicción no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar tipo de adicción", details: error });
  }
};

export const deleteTiposAdiccion = async (req: Request, res: Response) => {
  try {
    const { success, message } = await tiposAdiccionesService.deleteTiposAdiccion(req.params.id);
    if (!success) return res.status(404).json({ message: "Tipo de adicción no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar tipo de adicción físicamente", details: error });
  }
};