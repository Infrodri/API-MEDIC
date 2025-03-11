// src/types/FichasMedicaTypes.ts
import { Types } from "mongoose";

export interface AntecedentesPersonales {
  alergias?: string[];
  enfermedades?: string[];
  cirugias?: Types.ObjectId[]; // Referencia a OperacionesQuirurgicas
  vacunas?: string[];
  examenesFisicos?: { [key: string]: string | number }[];
  pruebasDeteccion?: { [key: string]: string | number }[];
  medicamentos?: { nombre: string; dosis: string; duracion: string }[];
  enfermedadesCronicas?: string[];
  antecedentesFamiliares?: string[];
  habitosSalud?: { alimentacion: string; ejercicio: string };
}

export interface ExploracionFisica {
  peso?: number;
  altura?: number;
  presionArterial?: string;
  frecuenciaCardiaca?: number;
  temperatura?: number;
  otrasObservaciones?: string;
}

export interface ExamenNeurologico {
  reflejos?: string;
  coordinacion?: string;
  estadoMental?: string;
  otrasObservaciones?: string;
}

export interface OrganosSentidos {
  vision?: string;
  audicion?: string;
  olfato?: string;
  otrasObservaciones?: string;
}

export interface Medicamento {
  _id?: string;
  nombre: string;
  descripcion?: string;
  esCritico?: boolean; // Nuevo campo
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecetaMedicamento {
  _id?: string;
  consulta: Types.ObjectId | string;
  medico: Types.ObjectId | string;
  medicamento: Types.ObjectId | string; // Referencia a Medicamentos
  dosis: string;
  duracion: string;
  instrucciones?: string;
  estado?: "Activo" | "Inactivo"; // Añadido para coincidir con el esquema
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExamenMedico {
  _id?: string;
  consulta: Types.ObjectId | string;
  medico: Types.ObjectId | string;
  tipo: string;
  fecha: Date;
  resultado?: string;
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConsultasMedicas {
  _id?: string;
  paciente: Types.ObjectId | string;
  medico: Types.ObjectId | string;
  fecha: Date;
  motivo: string;
  diagnostico?: string;
  tratamiento?: string;
  notas?: string;
  estado: "Activo" | "Inactivo";
  estadoConsulta?: "pendiente" | "Concluida" | "Derivada"| "completada"| "Cancelada"; // Nuevo campo para estado
  prioridad: "Normal" | "Alta" | "Urgente"; // Nuevo campo para estado
  recetas?: Types.ObjectId[]; // Referencia a RecetasMedicamentos
  examenes?: Types.ObjectId[]; // Referencia a ExamenesMedicos
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FichasMedicas {
  _id?: string;
  paciente: Types.ObjectId | string;
  antecedentesPersonales?: Types.ObjectId;
  operacionesQuirurgicas?: Types.ObjectId[];
  ginecologiaObstetrica?: Types.ObjectId;
  adicciones?: Types.ObjectId[];
  exploracionFisica?: Types.ObjectId;
  examenNeurologico?: Types.ObjectId;
  organosSentidos?: Types.ObjectId;
  consultasMedicas?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFichasMedicasService {
  getFichaByPaciente(pacienteId: string): Promise<FichasMedicas | null>;
  addSection(pacienteId: string, section: string, data: any, userId: string): Promise<any>;
  getSection(pacienteId: string, section: string): Promise<any>;
  createConsulta(pacienteId: string, data: Partial<ConsultasMedicas>, userId: string): Promise<ConsultasMedicas>;
  addReceta(consultaId: string, data: Partial<RecetaMedicamento>, userId: string): Promise<RecetaMedicamento>;
  addExamen(consultaId: string, data: Partial<ExamenMedico>, userId: string): Promise<ExamenMedico>;
  updateConsulta(consultaId: string, data: Partial<ConsultasMedicas>, userId: string): Promise<ConsultasMedicas>;
  getConsultaPrintable(consultaId: string): Promise<any>;
}