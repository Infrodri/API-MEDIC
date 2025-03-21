// src/types/DashboardTypes.ts
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";
import { Medico } from "types/MedicoTypes";
import { Paciente } from "types/PacientesTypes";
import { Especialidades } from "types/EspecialidadesTypes";
import { Types } from "mongoose";

export interface DashboardStats {
    totalPacientes: number;
    totalConsultas: number;
    totalMedicos: number;
    consultasHoy: number;
    consultasPendientes: number;
    consultasUrgentes: number;
    medicosActivos: number;
    consultasPorEstado: { [key: string]: number };
    consultasPorEspecialidad: { id: string; nombre: string; total: number }[];
    pacientesAtendidosPorEstado: { [key: string]: number }; // Añadido
  }

export interface ConsultaHoy {
  id: string;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: Date;
  estado: string;
  prioridad: string;
}

export interface ConsultasHoyResponse {
  consultas: ConsultaHoy[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PopulatedMedico extends Omit<Medico, "especialidades"> {
  especialidades: Especialidades[];
}

// Tipo simplificado para médicos
export interface SimplifiedMedico {
  _id: string; // Cambiamos a string para coincidir con lean()
  primerNombre: string;
  primerApellido: string;
  especialidades: { id: Types.ObjectId; nombre: string }[];
}

// Tipo simplificado para pacientes en espera
export interface SimplifiedPaciente {
  _id: string; // Cambiamos a string para coincidir con lean()
  primerNombre: string;
  primerApellido: string;
  telefono: string;
  estadoAtencion: "Pendiente" | "Atendido" | "Derivado";
}

export interface IDashboardService {
  getDashboardStats(): Promise<DashboardStats>;
  getConsultasHoy(page: number, limit: number): Promise<ConsultasHoyResponse>;
  getConsultasPorMesPorEspecialidad(year: number, month: number): Promise<{ id: string; nombre: string; total: number }[]>;
  getMedicosList(): Promise<SimplifiedMedico[]>;
  getPacientesEnEspera(): Promise<SimplifiedPaciente[]>; // Cambiamos a SimplifiedPaciente[]
}