import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { User } from "types/UsersTypes";

export interface Administrativos extends Document {
  getBasicInfo(): any;
  cedula: string; // ID number
  primerNombre: string; // First name
  segundoNombre: string; // Second name
  primerApellido: string; // First last name
  segundoApellido: string; // Second last name
  fechaNacimiento: Date; // Birth date
  lugarNacimiento: string; // Birth place
  nacionalidad: string; // Nationality
  ciudadDondeVive: string; // City of residence
  direccion: string; // Address
  telefono: string; // Landline phone
  celular: string; // Cell phone
  genero: string; // Gender
  profesion: string; // Profession
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