import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Roles } from "types/RolesTypes"; // Asegúrate de ajustar la ruta según tu estructura
import { Permisos } from "types/PermisosTypes";

export interface RolesPermisos extends Document {
  getBasicInfo(): any;
  rol: Types.ObjectId | Roles; // Relación con Roles
  permiso: Types.ObjectId | Permisos; // Relación con Permisos
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IRolesPermisosRepository extends Repository<RolesPermisos> {
  findOne(query: Query): Promise<RolesPermisos | null>;
  findActive(query?: Query): Promise<RolesPermisos[]>; // Method to find only active registros
}

export interface IRolesPermisosService {
  createRolesPermisos(rolPermiso: RolesPermisos): Promise<{ rolPermiso: RolesPermisos; message: string }>;
  findRolesPermisos(query?: Query): Promise<RolesPermisos[]>;
  findRolesPermisosById(id: string): Promise<RolesPermisos | null>;
  findRolesPermisosByRol(rolId: string): Promise<RolesPermisos[]>;
  updateRolesPermisos(id: string, rolPermiso: Partial<RolesPermisos>): Promise<{ rolPermiso: RolesPermisos | null; message: string }>;
  deleteRolesPermisos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteRolesPermisos(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}
