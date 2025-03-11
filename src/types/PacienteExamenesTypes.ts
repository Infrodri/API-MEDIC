// src/types/PacienteExamenTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "./PacientesTypes";
import { ExamenesMedicos } from "./ExamenesMedicosTypes";

export interface PacienteExamen extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente; // Referencia al paciente
  examenMedico: Types.ObjectId | ExamenesMedicos; // Referencia al tipo de examen médico
  fechaExamen: Date; // Fecha del examen
  resultado?: string; // Resultado del examen (puede ser texto, numérico o JSON)
  notas?: string; // Observaciones adicionales
  estado: "Activo" | "Inactivo"; // Estado para eliminación lógica
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPacienteExamenRepository extends Repository<PacienteExamen> {
  findOne(query: Query): Promise<PacienteExamen | null>;
  findActive(query?: Query): Promise<PacienteExamen[]>;
  findByPaciente(pacienteId: string): Promise<PacienteExamen[]>;
}

export interface IPacienteExamenService {
  createPacienteExamen(pacienteExamen: PacienteExamen): Promise<{ pacienteExamen: PacienteExamen; message: string }>;
  findPacienteExamen(query?: Query): Promise<PacienteExamen[]>;
  findPacienteExamenById(id: string): Promise<PacienteExamen | null>;
  findPacienteExamenByPaciente(pacienteId: string): Promise<PacienteExamen[]>;
  updatePacienteExamen(id: string, pacienteExamen: Partial<PacienteExamen>): Promise<{ pacienteExamen: PacienteExamen | null; message: string }>;
  deletePacienteExamen(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteExamen(id: string): Promise<{ success: boolean; message: string }>;
}