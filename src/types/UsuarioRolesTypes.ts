import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { User } from "types/UsersTypes"; // Asegúrate de ajustar la ruta según tu estructura
import { Roles } from "types/RolesTypes"; // Asegúrate de ajustar la ruta según tu estructura

export interface UsuarioRoles extends Document {
  // Modificación: Especificamos el tipo de retorno de getBasicInfo para mayor claridad
  getBasicInfo(): {
    _id: string;
    usuario: Types.ObjectId | User;
    rol: Types.ObjectId | Roles;
    estado: "Activo" | "Inactivo";
  };
  usuario: Types.ObjectId | User; // Relación con Users
  rol: Types.ObjectId | Roles; // Relación con Roles
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IUsuarioRolesRepository extends Repository<UsuarioRoles> {
  findOne(query: Query): Promise<UsuarioRoles | null>;
  findActive(query?: Query): Promise<UsuarioRoles[]>; // Method to find only active registros
}

export interface IUsuarioRolesService {
  createUsuarioRoles(usuarioRol: UsuarioRoles): Promise<{ usuarioRol: UsuarioRoles; message: string }>;
  findUsuarioRoles(query?: Query): Promise<UsuarioRoles[]>;
  findUsuarioRolesById(id: string): Promise<UsuarioRoles | null>;
  findUsuarioRolesByUsuario(usuarioId: string): Promise<UsuarioRoles[]>;
  updateUsuarioRoles(id: string, usuarioRol: Partial<UsuarioRoles>): Promise<{ usuarioRol: UsuarioRoles | null; message: string }>;
  deleteUsuarioRoles(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteUsuarioRoles(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}