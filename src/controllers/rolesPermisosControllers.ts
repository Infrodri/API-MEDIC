import { RolesPermisosRepository } from "@repositories/RolesPermisosRepositories";
import { RolesPermisosService } from "@services/RolesPermisosService";
import { Request, Response } from "express";
import { IRolesPermisosRepository, IRolesPermisosService, RolesPermisos } from "types/RolesPermisosTypes";

const rolesPermisosRepository: IRolesPermisosRepository = new RolesPermisosRepository();
const rolesPermisosService: IRolesPermisosService = new RolesPermisosService(rolesPermisosRepository);

export const findRolesPermisos = async (req: Request, res: Response) => {
  try {
    const rolesPermisos = await rolesPermisosService.findRolesPermisos();
    const basicInfoList = rolesPermisos.map((rolPermiso) => rolPermiso.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay relaciones rol-permisos encontradas." });

    res.json({ rolesPermisos: basicInfoList, message: "Lista de relaciones rol-permisos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relaciones rol-permisos", details: error });
  }
};

export const findRolesPermisosById = async (req: Request, res: Response) => {
  try {
    const rolPermiso = await rolesPermisosService.findRolesPermisosById(req.params.id);
    if (!rolPermiso) return res.status(404).json({ message: "Relación rol-permiso no encontrada" });

    res.json({ rolPermiso, message: "Relación rol-permiso encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relación rol-permiso", details: error });
  }
};

export const createRolesPermisos = async (req: Request, res: Response) => {
  try {
    const newRolPermiso: Omit<RolesPermisos, keyof Document> = req.body;
    const { rolPermiso, message } = await rolesPermisosService.createRolesPermisos(newRolPermiso);

    res.status(201).json({ rolPermiso, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear relación rol-permiso", details: error });
  }
};

export const updateRolesPermisos = async (req: Request, res: Response) => {
  try {
    const { rolPermiso, message } = await rolesPermisosService.updateRolesPermisos(req.params.id, req.body);
    if (!rolPermiso) return res.status(404).json({ message: "Relación rol-permiso no encontrada" });

    res.json({ rolPermiso, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar relación rol-permiso", details: error });
  }
};

export const softDeleteRolesPermisos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await rolesPermisosService.softDeleteRolesPermisos(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación rol-permiso no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación rol-permiso", details: error });
  }
};

export const deleteRolesPermisos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await rolesPermisosService.deleteRolesPermisos(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación rol-permiso no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación rol-permiso físicamente", details: error });
  }
};