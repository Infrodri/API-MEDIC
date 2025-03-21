// src/types/MedicoTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { User } from "./UsersTypes";


export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string; // Ejemplo: "primerNombre" o "-primerNombre" para descendente
}
  export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface Medico extends Document {
  getBasicInfo(): any;
  cedula: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: Date;
  lugarNacimiento: string;
  nacionalidad: string;
  ciudadDondeVive: string;
  direccion: string;
  telefono: string;
  celular: string;
  genero: string;
  especialidades: Types.ObjectId[];
  usuario: Types.ObjectId;
  estado: "Activo" | "Inactivo";
  estaActivo: boolean; // Nuevo campo
}

export interface IMedicoRepository extends Repository<Medico> {
  findOne(query: Query): Promise<Medico | null>;
  findActive(query?: Query): Promise<Medico[]>;
  countBySpecialty(): Promise<{ especialidad: string; count: number }[]>;
  countActiveToday(): Promise<number>;
  countTotal(): Promise<number>;
  findBySpecialty(especialidadId: string): Promise<Medico[]>;
  findByUser(userId: string): Promise<Medico[]>;
  findWithMultipleSpecialties(): Promise<Medico[]>;
  findPaginated(query?: Query, options?: PaginationOptions): Promise<PaginatedResult<Medico>>;
  updateActiveStatus(id: string, estaActivo: boolean): Promise<Medico | null>;
}

export interface IMedicoService {
  createMedico(medico: Medico): Promise<{ medico: Medico; message: string }>;
  findMedicos(query?: Query): Promise<Medico[]>;
  findMedicoById(id: string): Promise<Medico | null>;
  findMedicoByCedula(cedula: string): Promise<Medico | null>;
  updateMedico(id: string, medico: Partial<Medico>): Promise<{ medico: Medico | null; message: string }>;
  deleteMedico(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteMedico(id: string): Promise<{ success: boolean; message: string }>;
  getDoctorsBySpecialty(): Promise<{ especialidad: string; count: number }[]>;
  getActiveDoctorsToday(): Promise<number>;
  getTotalDoctors(): Promise<number>;
  getDoctorsBySpecialtyId(especialidadId: string): Promise<Medico[]>;
  getDoctorsByUserId(userId: string): Promise<Medico[]>;
  getDoctorsWithMultipleSpecialties(): Promise<Medico[]>;
  findMedicosPaginated(query?: Query, options?: PaginationOptions): Promise<PaginatedResult<Medico>>;
  toggleActiveStatus(id: string, estaActivo: boolean): Promise<{ medico: Medico | null; message: string }>;
}