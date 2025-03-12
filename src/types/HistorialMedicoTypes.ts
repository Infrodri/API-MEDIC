// src/types/HistorialMedicoTypes.ts
import { Document, Types } from "mongoose";

export interface Paciente {
  primerNombre: string;
  primerApellido: string;
}

export interface IHistorialMedico extends Document {
  paciente: Types.ObjectId;
  medico?: Types.ObjectId;
  alergias?: string;
  enfermedades?: string;
  cirugiasPrevias?: string;
  antecedentesFamiliares?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormattedHistorialMedico {
  id: string;
  paciente?: string;
  alergias?: string;
  enfermedades?: string;
  cirugiasPrevias?: string;
  antecedentesFamiliares?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHistorialMedicoRepository {
  createHistorialMedico(data: Partial<IHistorialMedico>): Promise<IHistorialMedico>;
  findHistorialMedicoById(id: string): Promise<IHistorialMedico | null>;
  findHistorialMedicoByPaciente(pacienteId: string): Promise<IHistorialMedico | null>;
  updateHistorialMedico(id: string, data: Partial<IHistorialMedico>): Promise<IHistorialMedico | null>;
  deleteHistorialMedico(id: string): Promise<IHistorialMedico | null>;
  getFormattedHistorialMedico(id: string): Promise<FormattedHistorialMedico | null>;
  findByPaciente(pacienteId: string): Promise<IHistorialMedico[]>;
  create(data: Partial<IHistorialMedico>, userId: string): Promise<IHistorialMedico>;
}

export interface IHistorialMedicoService {
  getHistorialByPaciente(pacienteId: string): Promise<IHistorialMedico[]>;
  addHistorialEntry(
    pacienteId: string,
    entry: Omit<IHistorialMedico, "_id" | "paciente" | "createdAt" | "updatedAt">,
    userId: string
  ): Promise<IHistorialMedico>;
}