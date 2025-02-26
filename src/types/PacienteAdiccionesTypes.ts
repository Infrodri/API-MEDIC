import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "types/PacientesTypes";
import { TiposAdiccion } from "types/TiposAdiccionesTypes";

export interface PacienteAdicciones extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente; // Relación con Paciente
  tipoAdiccion: Types.ObjectId | TiposAdiccion; // Relación con TiposAdicciones
  fechaInicio: Date; // Fecha de inicio de la adicción
  fechaFin?: Date; // Fecha de fin de la adicción (opcional)
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IPacienteAdiccionesRepository extends Repository<PacienteAdicciones> {
  findOne(query: Query): Promise<PacienteAdicciones | null>;
  findActive(query?: Query): Promise<PacienteAdicciones[]>; // Method to find only active registros
}

export interface IPacienteAdiccionesService {
  createPacienteAdicciones(pacienteAdiccion: PacienteAdicciones): Promise<{ pacienteAdiccion: PacienteAdicciones; message: string }>;
  findPacienteAdicciones(query?: Query): Promise<PacienteAdicciones[]>;
  findPacienteAdiccionesById(id: string): Promise<PacienteAdicciones | null>;
  findPacienteAdiccionesByPaciente(pacienteId: string): Promise<PacienteAdicciones[]>;
  updatePacienteAdicciones(id: string, pacienteAdiccion: Partial<PacienteAdicciones>): Promise<{ pacienteAdiccion: PacienteAdicciones | null; message: string }>;
  deletePacienteAdicciones(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteAdicciones(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}