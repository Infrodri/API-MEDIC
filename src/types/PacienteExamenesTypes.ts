// src/types/PacienteExamenesTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "./PacientesTypes";

export interface PacienteExamen extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  examenMedico: Types.ObjectId;
  fechaRealizacion: Date;
  resultado: string;
  notas: string;
  estado: "Activo" | "Inactivo";
}


export interface IPacienteExamenRepository extends Repository<PacienteExamen> {
  findOne(query: Query): Promise<PacienteExamen | null>;
  findActive(query?: Query): Promise<PacienteExamen[]>;
  findByPaciente(pacienteId: string): Promise<PacienteExamen[]>;
}

export interface IPacienteExamenService {
  createPacienteExamen(pacienteExamen: PacienteExamen): Promise<{ pacienteExamen: PacienteExamen; message: string }>;
  findPacienteExamenes(query?: Query): Promise<PacienteExamen[]>;
  findPacienteExamenById(id: string): Promise<PacienteExamen | null>;
  findPacienteExamenesByPaciente(pacienteId: string): Promise<PacienteExamen[]>;
  updatePacienteExamen(id: string, pacienteExamen: Partial<PacienteExamen>): Promise<{ pacienteExamen: PacienteExamen | null; message: string }>;
  deletePacienteExamen(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteExamen(id: string): Promise<{ success: boolean; message: string }>;
}