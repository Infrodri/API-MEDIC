import { UserRepository } from "@repositories/userRepositories";
import { UserService } from "@services/userService";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUserRepository, IUserService, User } from "types/UsersTypes";
import { permissions, Method } from "../types/PermissionsTypes";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const token = req.headers.authorization?.replace(/^Bearer\s+/, "");

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as User;
    const getUser = await userService.findUsersById(decoded.id);

    if (!getUser) {
      return res.status(400).json({ message: "User not found" });
    }

    req.currentUser = getUser;
    next();
  } catch (error: any) {
    console.error("Error de verificación de token:", error);
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export const getPermissons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentUser, method, path } = req;
    const { roles } = currentUser;

    console.log("Roles de Usuario:", roles);

    // Extraer el módulo de la ruta (primera parte después del "/")
    const currentModule = path.split("/")[1] || "";
    console.log("Module:", currentModule);

    // Buscar el permiso correspondiente al método HTTP
    const findMethod = permissions.find(x => x.method === Method[method as keyof typeof Method]);

    if (!findMethod) {
      return res.status(403).json({ message: "No hay permisos definidos para este método" });
    }

    // Generar el permiso esperado para el módulo
    const requiredPermission = `${currentModule}_${findMethod.scope}`;
    console.log("Required Permission:", requiredPermission);

    if (!findMethod.permissions.includes(requiredPermission)) {
      findMethod.permissions.push(requiredPermission);
    }

    // Obtener los permisos de los roles del usuario
    const mergedRolesPermissions = [...new Set(roles?.flatMap(role => role.permissions))];

    console.log("Permisos de rol de usuario:", mergedRolesPermissions);

    // Verificar si el usuario tiene permisos explícitos o mediante roles
    const userPermissions = currentUser.permissions?.length ? currentUser.permissions : mergedRolesPermissions;
    const hasPermission = userPermissions.includes(requiredPermission);

    console.log("User permissions:", userPermissions);
    console.log("Has permission?", hasPermission);

    if (!hasPermission) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("Error en el middleware getPermissons:", error);
    const err = error as Error;
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
