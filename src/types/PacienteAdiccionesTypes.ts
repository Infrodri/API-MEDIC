// src/types/PacienteAdiccionesTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "./PacientesTypes";
import { TiposAdiccion } from "./TiposAdiccionesTypes";

export interface PacienteAdiccion extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente; // Relación con Paciente
  tipoAdiccion: Types.ObjectId | TiposAdiccion; // Relación con TiposAdicciones
  frecuencia: string;
  duracion: string;
  fechaInicio: Date; // Fecha de inicio de la adicción
  fechaFin?: Date; // Fecha de fin de la adicción (opcional)
  notas: string;
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IPacienteAdiccionRepository extends Repository<PacienteAdiccion> {
  findOne(query: Query): Promise<PacienteAdiccion | null>;
  findActive(query?: Query): Promise<PacienteAdiccion[]>;
  findByPaciente(pacienteId: string): Promise<PacienteAdiccion[]>;
}

export interface IPacienteAdiccionService {
  createPacienteAdicciones(pacienteAdiccion: Omit<PacienteAdiccion, keyof Document>): Promise<{ pacienteAdiccion: PacienteAdiccion; message: string }>;
  findPacienteAdicciones(query?: Query): Promise<PacienteAdiccion[]>;
  findPacienteAdiccionesById(id: string): Promise<PacienteAdiccion | null>;
  findPacienteAdiccionesByPaciente(pacienteId: string): Promise<PacienteAdiccion[]>;
  updatePacienteAdicciones(id: string, pacienteAdiccion: Partial<PacienteAdiccion>): Promise<{ pacienteAdiccion: PacienteAdiccion | null; message: string }>;
  deletePacienteAdicciones(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteAdicciones(id: string): Promise<{ success: boolean; message: string }>;
}