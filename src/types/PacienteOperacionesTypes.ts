import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "types/PacientesTypes";
import { TiposOperacionesQuirurgicas } from "types/TiposOperacionesQuirurgicasTypes";

export interface PacienteOperaciones extends Document {
  getBasicInfo // Method to find only active registros
      (): any;
  paciente: Types.ObjectId | Paciente; // Relación con Paciente
  tipoOperacion: Types.ObjectId | TiposOperacionesQuirurgicas; // Relación con TiposOperacionesQuirurgicas
  fechaOperacion: Date; // Fecha de la operación
  resultado: string; // Resultado de la operación
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IPacienteOperacionesRepository extends Repository<PacienteOperaciones> {
  findOne(query: Query): Promise<PacienteOperaciones | null>;
  findActive(query?: Query): Promise<PacienteOperaciones[]>; // Method to find only active registros
}

export interface IPacienteOperacionesService {
  createPacienteOperaciones(pacienteOp: PacienteOperaciones): Promise<{ pacienteOp: PacienteOperaciones; message: string }>;
  findPacienteOperaciones(query?: Query): Promise<PacienteOperaciones[]>;
  findPacienteOperacionesById(id: string): Promise<PacienteOperaciones | null>;
  findPacienteOperacionesByPaciente(pacienteId: string): Promise<PacienteOperaciones[]>;
  updatePacienteOperaciones(id: string, pacienteOp: Partial<PacienteOperaciones>): Promise<{ pacienteOp: PacienteOperaciones | null; message: string }>;
  deletePacienteOperaciones(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteOperaciones(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}