// src/types/HistorialMedicoTypes.ts
import { Types } from "mongoose";

export interface HistorialMedico {
  _id?: string;
  paciente: Types.ObjectId | string; // ID del paciente (puede ser populado o string)
  fecha: Date; // Fecha de la entrada
  descripcion: string; // Descripción del evento médico
  diagnostico?: string; // Diagnóstico (opcional)
  tratamiento?: string; // Tratamiento prescrito (opcional)
  medico: Types.ObjectId | string; // ID del médico que registra la entrada
  notas?: string; // Notas adicionales (nuevo campo opcional)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHistorialMedicoService {
  getHistorialByPaciente(pacienteId: string): Promise<HistorialMedico[]>;
  addHistorialEntry(pacienteId: string, entry: Omit<HistorialMedico, "_id" | "paciente" | "createdAt" | "updatedAt">): Promise<HistorialMedico>;
}