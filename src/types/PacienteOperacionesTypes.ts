// src/types/PacienteOperacionesTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "./PacientesTypes";

export interface PacienteOperacion extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  tipoOperacionQuirurgica: Types.ObjectId;
  fechaOperacion: Date;
  notas: string;
  estado: "Activo" | "Inactivo";
}

export interface IPacienteOperacionRepository extends Repository<PacienteOperacion> {
  findOne(query: Query): Promise<PacienteOperacion | null>;
  findActive(query?: Query): Promise<PacienteOperacion[]>;
  findByPaciente(pacienteId: string): Promise<PacienteOperacion[]>;
}

export interface IPacienteOperacionService {
  createPacienteOperacion(pacienteOperacion: PacienteOperacion): Promise<{ pacienteOperacion: PacienteOperacion; message: string }>;
  findPacienteOperaciones(query?: Query): Promise<PacienteOperacion[]>;
  findPacienteOperacionById(id: string): Promise<PacienteOperacion | null>;
  findPacienteOperacionesByPaciente(pacienteId: string): Promise<PacienteOperacion[]>;
  updatePacienteOperacion(id: string, pacienteOperacion: Partial<PacienteOperacion>): Promise<{ pacienteOperacion: PacienteOperacion | null; message: string }>;
  deletePacienteOperacion(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteOperacion(id: string): Promise<{ success: boolean; message: string }>;
}