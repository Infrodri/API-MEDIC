import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface Roles extends Document {
  // Agregamos getBasicInfo para uniformidad
  getBasicInfo(): {
    _id: string;
    name: string;
    estado: "Activo" | "Inactivo";
  };
  name: string;
  // Eliminamos permissions; se manejará con RolesPermisos
  // Agregamos estado para eliminaciones lógicas
  estado: "Activo" | "Inactivo";
}

export interface IRolesRepository extends Repository<Roles> {
  // Agregamos findActive para soportar eliminaciones lógicas
  findActive(query?: Query): Promise<Roles[]>;
}

export interface IRolesService {
  createRoles(roles: Roles): Promise<Roles>;
  findRoles(query?: Query): Promise<Roles[]>;
  findRolesById(id: string): Promise<Roles | null>;
  updateRoles(id: string, roles: Partial<Roles>): Promise<Roles | null>;
  deleteRoles(id: string): Promise<boolean>;
  // Agregamos softDeleteRoles para eliminaciones lógicas
  softDeleteRoles(id: string): Promise<{ success: boolean; message: string }>;
}