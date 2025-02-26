import { TiposObstetricosGinecologicosRepository } from "@repositories/TiposObstetricosGinecologicosRepositories";
import { TiposObstetricosGinecologicosService } from "@services/TiposObstetricosGinecologicosService";
import { Request, Response } from "express";
import { ITiposObstetricosGinecologicosRepository, ITiposObstetricosGinecologicosService, TiposObstetricosGinecologicos } from "types/TiposObstetricosGinecologicosTypes";

const tiposObstetricosGinecologicosRepository: ITiposObstetricosGinecologicosRepository = new TiposObstetricosGinecologicosRepository();
const tiposObstetricosGinecologicosService: ITiposObstetricosGinecologicosService = new TiposObstetricosGinecologicosService(tiposObstetricosGinecologicosRepository);

export const findTiposObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const tipos = await tiposObstetricosGinecologicosService.findTiposObstetricosGinecologicos();
    const basicInfoList = tipos.map((tipos) => tipos.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay tipos obstétricos/ginecológicos encontrados." });

    res.json({ tipos: basicInfoList, message: "Lista de tipos obstétricos/ginecológicos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener tipos obstétricos/ginecológicos", details: error });
  }
};

export const findTiposObstetricosGinecologicosById = async (req: Request, res: Response) => {
  try {
    const tipos = await tiposObstetricosGinecologicosService.findTiposObstetricosGinecologicosById(req.params.id);
    if (!tipos) return res.status(404).json({ message: "Tipo obstétrico/ginecológico no encontrado" });

    res.json({ tipos, message: "Tipo obstétrico/ginecológico encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener tipo obstétrico/ginecológico", details: error });
  }
};

export const createTiposObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const newTipos: Omit<TiposObstetricosGinecologicos, keyof Document> = req.body;
    const { tipos, message } = await tiposObstetricosGinecologicosService.createTiposObstetricosGinecologicos(newTipos);

    res.status(201).json({ tipos, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear tipo obstétrico/ginecológico", details: error });
  }
};

export const updateTiposObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const { tipos, message } = await tiposObstetricosGinecologicosService.updateTiposObstetricosGinecologicos(req.params.id, req.body);
    if (!tipos) return res.status(404).json({ message: "Tipo obstétrico/ginecológico no encontrado" });

    res.json({ tipos, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar tipo obstétrico/ginecológico", details: error });
  }
};

export const softDeleteTiposObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await tiposObstetricosGinecologicosService.softDeleteTiposObstetricosGinecologicos(req.params.id);
    if (!success) return res.status(404).json({ message: "Tipo obstétrico/ginecológico no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar tipo obstétrico/ginecológico", details: error });
  }
};

export const deleteTiposObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await tiposObstetricosGinecologicosService.deleteTiposObstetricosGinecologicos(req.params.id);
    if (!success) return res.status(404).json({ message: "Tipo obstétrico/ginecológico no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar tipo obstétrico/ginecológico físicamente", details: error });
  }
};