import { RolesRepository } from "@repositories/rolesRepositories";
import { RolesService } from "@services/RolesService";
import { NextFunction, Request, Response } from "express";
import { IRolesRepository, IRolesService } from "types/RolesTypes";

const rolesRepository: IRolesRepository = new RolesRepository();
const rolesService: IRolesService = new RolesService(rolesRepository);

// Middleware para verificar y asignar roles al crear un usuario
export const checkRoles = async (req: Request, res: Response, next: NextFunction) => {
  // Sección 1: Obtener los roles del cuerpo o asignar por defecto
  let roles: string[] = req.body && req.body.roles ? req.body.roles : ["medico"];
  
  // Caso especial: Si el username es "admin", asignamos el rol "admin"
  if (req.body.username === "admin") {
    roles = ["admin"];
  }
  console.log("roles solicitados :>> ", roles);

  try {
    // Sección 2: Verificar que los roles existan en la base de datos
    const findRoles = await rolesService.findRoles({ name: { $in: roles }, estado: "Activo" });

    // Sección 3: Validar la existencia de los roles
    if (findRoles.length !== roles.length) {
      // Si un rol no existe, crearlo (opcional para "admin")
      const missingRoles = roles.filter((r) => !findRoles.some((fr) => fr.name === r));
      if (missingRoles.includes("admin")) {
        const newAdminRole = await rolesService.createRoles({ name: "admin" });
        findRoles.push(newAdminRole);
      } else {
        return res.status(404).json({ message: "Roles no encontrados", missing: missingRoles });
      }
    }

    // Sección 4: Asignar los IDs de los roles al cuerpo de la solicitud
    req.body.roles = findRoles.map((x) => x._id);
    console.log("req.body.roles asignados :>> ", req.body.roles);

    // Sección 5: Continuar con la siguiente middleware/ruta
    next();
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ message: "Error al verificar roles", details: error });
  }
};