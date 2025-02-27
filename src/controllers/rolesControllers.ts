import { RolesRepository } from "@repositories/rolesRepositories";
import { RolesService } from "@services/RolesService";
import { Request, Response } from "express";
import { IRolesRepository, IRolesService, Roles } from "types/RolesTypes";

const rolesRepository: IRolesRepository = new RolesRepository();
const rolesService: IRolesService = new RolesService(rolesRepository);

export const findRoles = async (req: Request, res: Response) => {
  try {
    const roles = await rolesService.findRoles();
    const basicInfoList = roles.map((role) => role.getBasicInfo());
    if (basicInfoList.length === 0)
      return res.status(404).json({ message: "No hay roles encontrados." });

    res.json({
      roles: basicInfoList,
      message: "Lista de roles obtenida con éxito",
    });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener roles", details: error });
  }
};

export const findRolesById = async (req: Request, res: Response) => {
  try {
    const role = await rolesService.findRolesById(req.params.id);
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    res.json({ role, message: "Rol encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener rol", details: error });
  }
};

export const createRoles = async (req: Request, res: Response) => {
  try {
    const newRole: Omit<Roles, keyof Document> = req.body;
    const role = await rolesService.createRoles(newRole);
    res.status(201).json({ role, message: "Rol creado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear rol", details: error });
  }
};

export const updateRoles = async (req: Request, res: Response) => {
  try {
    const role = await rolesService.updateRoles(req.params.id, req.body);
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    res.json({ role, message: "Rol actualizado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar rol", details: error });
  }
};

export const deleteRoles = async (req: Request, res: Response) => {
  try {
    const success = await rolesService.deleteRoles(req.params.id);
    if (!success) return res.status(404).json({ message: "Rol no encontrado" });

    res.json({ success, message: "Rol eliminado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar rol", details: error });
  }
};

export const softDeleteRoles = async (req: Request, res: Response) => {
  try {
    const { success, message } = await rolesService.softDeleteRoles(
      req.params.id
    );
    if (!success) return res.status(404).json({ message: "Rol no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(500)
      .json({ error: "Error al eliminar rol lógicamente", details: error });
  }
};
