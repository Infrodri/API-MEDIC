// src/types/PacienteAdiccionesTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { TiposAdiccion } from "types/TiposAdiccionesTypes";
import { Paciente } from "./PacientesTypes";

export interface PacienteAdiccion extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  tipoAdiccion: Types.ObjectId | TiposAdiccion;
  fechaInicio: Date;
  fechaFin?: Date;
  notas: string;
  estado: "Activo" | "Inactivo";
}

export interface IPacienteAdiccionRepository extends Repository<PacienteAdiccion> {
  findOne(query: Query): Promise<PacienteAdiccion | null>;
  findActive(query?: Query): Promise<PacienteAdiccion[]>;
  findByPaciente(pacienteId: string): Promise<PacienteAdiccion[]>;
}

export interface IPacienteAdiccionService {
  createPacienteAdiccion(pacienteAdiccion: PacienteAdiccion): Promise<{ pacienteAdiccion: PacienteAdiccion; message: string }>;
  findPacienteAdicciones(query?: Query): Promise<PacienteAdiccion[]>;
  findPacienteAdiccionById(id: string): Promise<PacienteAdiccion | null>;
  findPacienteAdiccionesByPaciente(pacienteId: string): Promise<PacienteAdiccion[]>;
  updatePacienteAdiccion(id: string, pacienteAdiccion: Partial<PacienteAdiccion>): Promise<{ pacienteAdiccion: PacienteAdiccion | null; message: string }>;
  deletePacienteAdiccion(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteAdiccion(id: string): Promise<{ success: boolean; message: string }>;
}