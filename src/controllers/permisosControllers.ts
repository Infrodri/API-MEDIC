import { PermisosRepository } from "@repositories/PermisosRepositories";
import { PermisosService } from "@services/PermisosService";
import { Request, Response } from "express";
import { IPermisosRepository, IPermisosService, Permisos } from "types/PermisosTypes";

const permisosRepository: IPermisosRepository = new PermisosRepository();
const permisosService: IPermisosService = new PermisosService(permisosRepository);

export const findPermisos = async (req: Request, res: Response) => {
  try {
    const permisos = await permisosService.findPermisos();
    const basicInfoList = permisos.map((permiso) => permiso.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay permisos encontrados." });

    res.json({ permisos: basicInfoList, message: "Lista de permisos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener permisos", details: error });
  }
};

export const findPermisosById = async (req: Request, res: Response) => {
  try {
    const permiso = await permisosService.findPermisosById(req.params.id);
    if (!permiso) return res.status(404).json({ message: "Permiso no encontrado" });

    res.json({ permiso, message: "Permiso encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener permiso", details: error });
  }
};

export const createPermisos = async (req: Request, res: Response) => {
  try {
    const newPermiso: Omit<Permisos, keyof Document> = req.body;
    const { permiso, message } = await permisosService.createPermisos(newPermiso);

    res.status(201).json({ permiso, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear permiso", details: error });
  }
};

export const updatePermisos = async (req: Request, res: Response) => {
  try {
    const { permiso, message } = await permisosService.updatePermisos(req.params.id, req.body);
    if (!permiso) return res.status(404).json({ message: "Permiso no encontrado" });

    res.json({ permiso, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar permiso", details: error });
  }
};

export const softDeletePermisos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await permisosService.softDeletePermisos(req.params.id);
    if (!success) return res.status(404).json({ message: "Permiso no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar permiso", details: error });
  }
};

export const deletePermisos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await permisosService.deletePermisos(req.params.id);
    if (!success) return res.status(404).json({ message: "Permiso no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar permiso físicamente", details: error });
  }
};