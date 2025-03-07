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

// export const getPermissons = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { currentUser, method, path } = req;
//     const { roles } = currentUser;

//     console.log("Roles de Usuario:", roles);

//     // Extraer el módulo de la ruta (primera parte después del "/")
//     const currentModule = path.split("/")[1] || "";
//     console.log("Module:", currentModule);

//     // Buscar el permiso correspondiente al método HTTP
//     const findMethod = permissions.find(x => x.method === Method[method as keyof typeof Method]);
//       console.log("findMethod", findMethod );
//     if (!findMethod) {
//       return res.status(403).json({ message: "No hay permisos definidos para este método" });
//     }

//     // Generar el permiso esperado para el módulo
//     const requiredPermission = `${currentModule}_${findMethod.scope}`;
//     console.log("Required Permission:", requiredPermission);

//     if (!findMethod.permissions.includes(requiredPermission) || findMethod.permissions.includes("admin_granted") ) {
//       findMethod.permissions.push(requiredPermission);
//     }

//     // Obtener los permisos de los roles del usuario
//     const mergedRolesPermissions = [...new Set(roles?.flatMap(role => role.permissions))];

//     console.log("Permisos de rol de usuario:", mergedRolesPermissions);

//     // Verificar si el usuario tiene permisos explícitos o mediante roles
//     const userPermissions = currentUser.permissions?.length ? currentUser.permissions : mergedRolesPermissions;
//     const hasPermission = userPermissions.includes(requiredPermission);

//     console.log("User permissions:", userPermissions);
//     console.log("Has permission?", hasPermission);

//     if (!hasPermission) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     next();
//   } catch (error) {
//     console.error("Error en el middleware getPermissons:", error);
//     const err = error as Error;
//     res.status(500).json({ message: "Internal server error", error: err.message });
//   }
// };

export const getPermissons = async (req: Request, res: Response, next: NextFunction) => {
  // - Obtener lo roles, (desde currentUser)
  // - Obtener el Metodo HTTP de la petición
  const { currentUser, method, path } = req;
  const { roles } = currentUser;
  console.log("currentUser :>> ", currentUser);
  // - Obtener el path/modulos (usuarios - roles - posts)
  const currentModule = path.replace(/^\/([^\/]+).*/, "$1");
  console.log("currentModule :>> ", currentModule);

  // - Conseguir en los permisos el metodo que coincida para obtener el objeto que contiene el scope
  const findMethod = permissions.find(x => x.method === Method[method as keyof typeof Method]);

  // - Armar el permiso correspondiente al scope en el momento de la petición
  if (!findMethod?.permissions.includes(`${currentModule}_${findMethod.scope}`)) {
    findMethod?.permissions.push(`${currentModule}_${findMethod.scope}`);
  }
  console.log("findMethod :>> ", findMethod);

  // - obtener todos los permisos de los roles del usuario
  // const rolesPermissions = roles?.map(role => role.permissions);
  // const flatPermissions = rolesPermissions?.flat();
  // const mergedPermissions = [new Set(flatPermissions)];
  const mergedRolesPermissions = [...new Set(roles?.flatMap(x => x.permissions))];
  console.log("mergedPermissions :>> ", mergedRolesPermissions);

  // - Verificar si el usuario Tiene Permisos
  //     - Tienen mayor prioridad q los permisos de los roles
  //lo que me falto

  let userPermissions: string[] = [];

  if (currentUser.permissions?.length !== 0) {
    userPermissions = currentUser.permissions!;
  } else {
    userPermissions = mergedRolesPermissions;
  }

  console.log("userPermissions :>> ", userPermissions);
  // - comparar los permisos armados en el scope con los permisos de los roles de usuario
  const permissionsGranted = findMethod?.permissions.find(x => userPermissions.includes(x));
  console.log("permissionsGranted:>> ", permissionsGranted);

  // - si no hay match, regresamos un error unauthorized
  if (!permissionsGranted) return res.status(401).send("Unauthorized!!!");
  // - si todo bien next()
  next();
};