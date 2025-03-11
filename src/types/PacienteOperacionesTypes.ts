// src/types/PacienteOperacionesTypes.ts (asumido)
import { Document, Types } from "mongoose";
import { Paciente } from "./PacientesTypes";
import { TiposOperacionesQuirurgicas } from "./TiposOperacionesQuirurgicasTypes";

export interface PacienteOperacion extends Document {
  paciente: Types.ObjectId | Paciente;
  tipoOperacionQuirurgica: Types.ObjectId | TiposOperacionesQuirurgicas;
  fechaOperacion: Date;
  observaciones?: string;
  estado: "Activo" | "Inactivo";
}

export interface IPacienteOperacionRepository {
  create(data: PacienteOperacion): Promise<PacienteOperacion>;
  findActive(query?: any): Promise<PacienteOperacion[]>;
  findById(id: string): Promise<PacienteOperacion | null>;
  findByPaciente(pacienteId: string): Promise<PacienteOperacion[]>;
  update(id: string, data: Partial<PacienteOperacion>): Promise<PacienteOperacion | null>;
  delete(id: string): Promise<boolean>;
}

export interface IPacienteOperacionService {
  createPacienteOperacion(pacienteOperacion: PacienteOperacion): Promise<{ pacienteOperacion: PacienteOperacion; message: string }>;
  findPacienteOperacion(query?: any): Promise<PacienteOperacion[]>;  
  findPacienteOperacionById(id: string): Promise<PacienteOperacion | null>;
  findPacienteOperacionByPaciente(pacienteId: string): Promise<PacienteOperacion[]>;
  updatePacienteOperacion(id: string, pacienteOperacion: Partial<PacienteOperacion>): Promise<{ pacienteOperacion: PacienteOperacion | null; message: string }>;
  deletePacienteOperacion(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteOperacion(id: string): Promise<{ success: boolean; message: string }>;
}

