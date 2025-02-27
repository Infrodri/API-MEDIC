import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface Permisos extends Document {
  // Modificación: Especificamos el tipo de retorno de getBasicInfo para mayor claridad
  getBasicInfo(): {
    _id: string;
    nombre: string;
    estado: "Activo" | "Inactivo";
  };
  nombre: string; // Nombre del permiso (e.g., "read_users", "write_posts")
  descripcion: string; // Descripción del permiso
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IPermisosRepository extends Repository<Permisos> {
  findOne(query: Query): Promise<Permisos | null>;
  findActive(query?: Query): Promise<Permisos[]>; // Method to find only active permisos
}

export interface IPermisosService {
  createPermisos(permiso: Permisos): Promise<{ permiso: Permisos; message: string }>;
  findPermisos(query?: Query): Promise<Permisos[]>;
  findPermisosById(id: string): Promise<Permisos | null>;
  findPermisosByNombre(nombre: string): Promise<Permisos | null>;
  updatePermisos(id: string, permiso: Partial<Permisos>): Promise<{ permiso: Permisos | null; message: string }>;
  deletePermisos(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePermisos(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}