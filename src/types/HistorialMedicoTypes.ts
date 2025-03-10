// src/types/HistorialMedicoTypes.ts
import { Types } from "mongoose";

export interface AntecedentesPersonales {
  alergias?: string[];
  enfermedades?: string[];
  cirugias?: Types.ObjectId[]; // Referencia a pacienteOperaciones
  vacunas?: string[];
  examenesFisicos?: { [key: string]: string | number }[]; // Resultados de exámenes físicos
  pruebasDeteccion?: { [key: string]: string | number }[]; // Resultados de pruebas
  medicamentos?: { nombre: string; dosis: string; duracion: string }[]; // Medicamentos actuales
  enfermedadesCronicas?: string[];
  antecedentesFamiliares?: string[];
  habitosSalud?: { alimentacion: string; ejercicio: string };
}

export interface ExploracionFisica {
  peso?: number; // kg
  altura?: number; // cm
  presionArterial?: string; // ej. "120/80 mmHg"
  frecuenciaCardiaca?: number; // lpm
  temperatura?: number; // °C
  otrasObservaciones?: string;
}

export interface ExamenNeurologico {
  reflejos?: string;
  coordinacion?: string;
  estadoMental?: string;
  otrasObservaciones?: string;
}

export interface OrganosSentidos {
  vision?: string; // ej. "20/20"
  audicion?: string; // ej. "Normal"
  olfato?: string; // ej. "Normal"
  otrasObservaciones?: string;
}

export interface HistorialMedico {
  _id?: string;
  paciente: Types.ObjectId | string; // ID del paciente
  fecha: Date;
  antecedentesPersonales?: AntecedentesPersonales;
  operacionesQuirurgicas?: Types.ObjectId[]; // Referencia a pacienteOperaciones
  ginecologiaObstetrica?: Types.ObjectId; // Referencia a pacienteObstetricosGinecologicos
  adicciones?: Types.ObjectId[]; // Referencia a pacienteAdicciones
  exploracionFisica?: ExploracionFisica;
  examenNeurologico?: ExamenNeurologico;
  organosSentidos?: OrganosSentidos;
  medico: Types.ObjectId | string; // ID del médico
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHistorialMedicoService {
  getHistorialByPaciente(pacienteId: string): Promise<HistorialMedico[]>;
  addHistorialEntry(pacienteId: string, entry: Omit<HistorialMedico, "_id" | "paciente" | "createdAt" | "updatedAt">, userId: string): Promise<HistorialMedico>;
}