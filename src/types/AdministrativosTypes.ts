import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { User } from "types/UsersTypes";

export interface Administrativos extends Document {
  getBasicInfo(): any;
  nombre: string; // Nombre del administrativo
  apellido: string; // Apellido del administrativo
  cedula: string; // Cédula del administrativo
  profesion: string; // Profesión (e.g., "Recepcionista")
  usuario: Types.ObjectId | User; // Relación con Users para autenticación
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IAdministrativosRepository extends Repository<Administrativos> {
  findOne(query: Query): Promise<Administrativos | null>;
  findActive(query?: Query): Promise<Administrativos[]>; // Method to find only active administrativos
}

export interface IAdministrativosService {
  createAdministrativos(administrativo: Administrativos): Promise<{ administrativo: Administrativos; message: string }>;
  findAdministrativos(query?: Query): Promise<Administrativos[]>;
  findAdministrativosById(id: string): Promise<Administrativos | null>;
  findAdministrativosByCedula(cedula: string): Promise<Administrativos | null>;
  updateAdministrativos(id: string, administrativo: Partial<Administrativos>): Promise<{ administrativo: Administrativos | null; message: string }>;
  deleteAdministrativos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteAdministrativos(id: string): Promise<{ success: boolean; message: string }>;
}