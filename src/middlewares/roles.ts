import { RolesRepository } from "@repositories/rolesRepositories";
import { RolesService } from "@services/RolesService";
import { NextFunction, Request, Response } from "express";
import { IRolesRepository, IRolesService } from "types/RolesTypes";

const rolesRepository: IRolesRepository = new RolesRepository();
const rolesService: IRolesService = new RolesService(rolesRepository);

export const checkRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let roles: string[] = req.body?.roles ?? [];

    if (!Array.isArray(roles) || roles.length === 0) {
      console.log("No roles provided, assigning default role: 'user'");
      roles = ["user"];
    }

    // Verificar que los roles existen en la BD
    const findRoles = await rolesService.findRoles({ name: { $in: roles } });

    if (findRoles.length === 0) {
      return res.status(404).json({ message: "No valid roles found in the database" });
    }

    req.body.roles = findRoles.map(role => role._id);
    next();
  } catch (error) {
    console.error("Error in checkRoles middleware:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
