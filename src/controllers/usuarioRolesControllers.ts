import { UsuarioRolesRepository } from "@repositories/UsuarioRolesRepositories";
import { UsuarioRolesService } from "@services/UsuarioRolesService";
import { Request, Response } from "express";
import { IUsuarioRolesRepository, IUsuarioRolesService, UsuarioRoles } from "types/UsuarioRolesTypes";

const usuarioRolesRepository: IUsuarioRolesRepository = new UsuarioRolesRepository();
const usuarioRolesService: IUsuarioRolesService = new UsuarioRolesService(usuarioRolesRepository);

export const findUsuarioRoles = async (req: Request, res: Response) => {
  try {
    const usuarioRoles = await usuarioRolesService.findUsuarioRoles();
    const basicInfoList = usuarioRoles.map((usuarioRol) => usuarioRol.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay relaciones usuario-roles encontradas." });

    res.json({ usuarioRoles: basicInfoList, message: "Lista de relaciones usuario-roles obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relaciones usuario-roles", details: error });
  }
};

export const findUsuarioRolesById = async (req: Request, res: Response) => {
  try {
    const usuarioRol = await usuarioRolesService.findUsuarioRolesById(req.params.id);
    if (!usuarioRol) return res.status(404).json({ message: "Relación usuario-rol no encontrada" });

    res.json({ usuarioRol, message: "Relación usuario-rol encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relación usuario-rol", details: error });
  }
};

export const createUsuarioRoles = async (req: Request, res: Response) => {
  try {
    const newUsuarioRol: Omit<UsuarioRoles, keyof Document> = req.body;
    const { usuarioRol, message } = await usuarioRolesService.createUsuarioRoles(newUsuarioRol);

    res.status(201).json({ usuarioRol, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear relación usuario-rol", details: error });
  }
};

export const updateUsuarioRoles = async (req: Request, res: Response) => {
  try {
    const { usuarioRol, message } = await usuarioRolesService.updateUsuarioRoles(req.params.id, req.body);
    if (!usuarioRol) return res.status(404).json({ message: "Relación usuario-rol no encontrada" });

    res.json({ usuarioRol, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar relación usuario-rol", details: error });
  }
};

export const softDeleteUsuarioRoles = async (req: Request, res: Response) => {
  try {
    const { success, message } = await usuarioRolesService.softDeleteUsuarioRoles(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación usuario-rol no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación usuario-rol", details: error });
  }
};

export const deleteUsuarioRoles = async (req: Request, res: Response) => {
  try {
    const { success, message } = await usuarioRolesService.deleteUsuarioRoles(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación usuario-rol no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación usuario-rol físicamente", details: error });
  }
};