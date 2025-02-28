import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { User } from "./UsersTypes";

export interface Medico extends Document {
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
  especialidad: string;
  usuario: Types.ObjectId | User; // Relación con Users para autenticación
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IMedicoRepository extends Repository<Medico> {
  findOne(query: Query): Promise<Medico | null>;
  findActive(query?: Query): Promise<Medico[]>; // Method to find only active medicos
}

export interface IMedicoService {
  createMedico(medico: Medico): Promise<{ medico: Medico; message: string }>;
  findMedicos(query?: Query): Promise<Medico[]>;
  findMedicoById(id: string): Promise<Medico | null>;
  findMedicoByCedula(cedula: string): Promise<Medico | null>;
  updateMedico(id: string, medico: Partial<Medico>): Promise<{ medico: Medico | null; message: string }>;
  deleteMedico(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteMedico(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}