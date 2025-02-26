import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface Especialidades extends Document {
  getBasicInfo(): any;
  nombre: string; // Nombre de la especialidad (e.g., "Cardiología")
  descripcion: string; // Descripción de la especialidad
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IEspecialidadesRepository extends Repository<Especialidades> {
  findOne(query: Query): Promise<Especialidades | null>;
  findActive(query?: Query): Promise<Especialidades[]>; // Method to find only active especialidades
}

export interface IEspecialidadesService {
  createEspecialidades(especialidad: Especialidades): Promise<{ especialidad: Especialidades; message: string }>;
  findEspecialidades(query?: Query): Promise<Especialidades[]>;
  findEspecialidadesById(id: string): Promise<Especialidades | null>;
  findEspecialidadesByNombre(nombre: string): Promise<Especialidades | null>;
  updateEspecialidades(id: string, especialidad: Partial<Especialidades>): Promise<{ especialidad: Especialidades | null; message: string }>;
  deleteEspecialidades(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteEspecialidades(id: string): Promise<{ success: boolean; message: string }>;
}