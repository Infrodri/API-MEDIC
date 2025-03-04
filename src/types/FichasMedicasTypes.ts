import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Medico } from "types/MedicoTypes";
import { Paciente } from "types/PacientesTypes";
import { Especialidades } from "./EspecialidadesTypes";

export interface FichasMedicas extends Document {
  getBasicInfo(): any;
  paciente?: Paciente[];// Relación con Paciente
  medico?: Medico[]; // Relación con Medico
  especialidad?: Especialidades[]; // Relación con Medico

  fecha: Date; // Fecha de la ficha
  diagnostico: string; // Diagnóstico médico
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IFichasMedicasRepository extends Repository<FichasMedicas> {
  findOne(query: Query): Promise<FichasMedicas | null>;
  findActive(query?: Query): Promise<FichasMedicas[]>; // Method to find only active fichas médicas
}

export interface IFichasMedicasService {
  createFichasMedicas(ficha: FichasMedicas): Promise<{ ficha: FichasMedicas; message: string }>;
  findFichasMedicas(query?: Query): Promise<FichasMedicas[]>;
  findFichasMedicasById(id: string): Promise<FichasMedicas | null>;
  findFichasMedicasByPaciente(pacienteId: string): Promise<FichasMedicas[]>;
  updateFichasMedicas(id: string, ficha: Partial<FichasMedicas>): Promise<{ ficha: FichasMedicas | null; message: string }>;
  deleteFichasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteFichasMedicas(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}