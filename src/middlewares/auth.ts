import { UserRepository } from "@repositories/userRepositories";
import { UserService } from "@services/userService";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Method } from "types/PermissionsTypes";
import { IUserRepository, IUserService, User } from "types/UsersTypes";
import {  RolesPermisos } from "types/RolesPermisosTypes";
import { UsuarioRolesModel } from "@models/UsuarioRoles";
import { RolesPermisosModel } from "@models/RolesPermisos";
// import { Permisos } from "types/PermisosTypes";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const token = req.headers.authorization?.replace(/^Bearer\s+/, "") as string;

  try {
    const verify = jwt.verify(token, jwtSecret) as User;
    const getUser = await userService.findUsersById(verify.id);
    if (!getUser) return res.status(400).json({ message: "Usuario no encontrado" });

    req.currentUser = getUser;
    next();
  } catch (error: any) {
    console.log("error :>> ", error);
    res.status(401).json({ message: "Token inválido o expirado", details: error.message });
  }
};

export const getPermissons = async (req: Request, res: Response, next: NextFunction) => {
  const { currentUser, method, path } = req;
  if (!currentUser) return res.status(401).json({ message: "Usuario no autenticado" });

  const currentModule = path.replace(/^\/([^\/]+).*/, "$1");
  console.log("currentModule :>> ", currentModule);

  // Obtener roles del usuario
  const userRoles = await UsuarioRolesModel.find({ usuario: currentUser._id, estado: "Activo" }).populate("rol");
  if (!userRoles.length) return res.status(403).json({ message: "No tienes roles asignados" });

  // Verificar si el usuario tiene el rol "admin"
  const isAdmin = userRoles.some((ur) => (ur.rol as any).name === "admin");
  if (isAdmin) {
    console.log("Usuario es admin, acceso total concedido");
    req.userPermissions = ["all"]; // Indicador de acceso total
    return next(); // Admin tiene acceso completo, no verificamos permisos individuales
  }

  // Obtener permisos para roles no admin
  const roleIds = userRoles.map((ur) => ur.rol._id);
  const rolePermissions = (await RolesPermisosModel.find({ rol: { $in: roleIds }, estado: "Activo" }).populate("permiso")) as RolesPermisos[];
  const userPermissions = rolePermissions.map((rp) => (rp.permiso as Permisos).nombre);
  console.log("userPermissions :>> ", userPermissions);

  // Construir permiso requerido
  const methodScope = Method[method as keyof typeof Method].toLowerCase();
  const requiredPermission = `${currentModule}_${methodScope}`;
  console.log("requiredPermission :>> ", requiredPermission);

  // Verificar permiso
  const hasPermission = userPermissions.includes(requiredPermission);
  if (!hasPermission) return res.status(403).json({ message: "No tienes permiso para esta acción" });

  req.userPermissions = userPermissions;
  next();
};