import { AdministrativosRepository } from "@repositories/AdministrativosRepositories";
import { AdministrativosService } from "@services/AdministrativosService";
import { Request, Response } from "express";
import { IAdministrativosRepository, IAdministrativosService, Administrativos } from "types/AdministrativosTypes";

const administrativosRepository: IAdministrativosRepository = new AdministrativosRepository();
const administrativosService: IAdministrativosService = new AdministrativosService(administrativosRepository);

export const findAdministrativos = async (req: Request, res: Response) => {
  try {
    const administrativos = await administrativosService.findAdministrativos();
    const basicInfoList = administrativos.map((administrativo) => administrativo.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay administrativos encontrados." });

    res.json({ administrativos: basicInfoList, message: "Lista de administrativos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener administrativos", details: error });
  }
};

export const findAdministrativosById = async (req: Request, res: Response) => {
  try {
    const administrativo = await administrativosService.findAdministrativosById(req.params.id);
    if (!administrativo) return res.status(404).json({ message: "Administrativo no encontrado" });

    res.json({ administrativo, message: "Administrativo encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener administrativo", details: error });
  }
};

export const createAdministrativos = async (req: Request, res: Response) => {
  try {
    const newAdministrativo: Omit<Administrativos, keyof Document> = req.body;
    const { administrativo, message } = await administrativosService.createAdministrativos(newAdministrativo);

    res.status(201).json({ administrativo, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear administrativo", details: error });
  }
};

export const updateAdministrativos = async (req: Request, res: Response) => {
  try {
    const { administrativo, message } = await administrativosService.updateAdministrativos(req.params.id, req.body);
    if (!administrativo) return res.status(404).json({ message: "Administrativo no encontrado" });

    res.json({ administrativo, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar administrativo", details: error });
  }
};

export const softDeleteAdministrativos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await administrativosService.softDeleteAdministrativos(req.params.id);
    if (!success) return res.status(404).json({ message: "Administrativo no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar administrativo", details: error });
  }
};

export const deleteAdministrativos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await administrativosService.deleteAdministrativos(req.params.id);
    if (!success) return res.status(404).json({ message: "Administrativo no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar administrativo físicamente", details: error });
  }
};