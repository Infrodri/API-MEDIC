// src/types/ConsultasMedicasTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Medico } from "./MedicoTypes";
import { Paciente } from "./PacientesTypes";
import { RecetasMedicamentos } from "./RecetasMedicamentosTypes";
import { PacienteExamen } from "./PacienteExamenesTypes";

export interface ConsultasMedicas extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  medico: Types.ObjectId | Medico;
  fecha: Date;
  motivo: string;
  sintomas: string; // Nuevo campo para síntomas
  diagnostico: string;
  tratamiento: string;
  observaciones: string; // Renombrado de "notas" para consistencia
  recomendacionDescanso?: string; // Nuevo campo opcional
  estado: "Activo" | "Inactivo";
  estadoConsulta: "Pendiente" | "Concluida" | "Derivada" | "Cancelada";
  medicoDerivado?: Types.ObjectId | Medico;
  prioridad: "Normal" | "Alta" | "Urgente";
  duracion: number; // Duración en minutos
  recetas: (Types.ObjectId | RecetasMedicamentos)[]; // Referencia a recetas
  examenes: (Types.ObjectId | PacienteExamen)[]; // Referencia a exámenes del paciente
}

export interface IConsultasMedicasRepository extends Repository<ConsultasMedicas> {
  findOne(query: Query): Promise<ConsultasMedicas | null>;
  findActive(query?: Query): Promise<ConsultasMedicas[]>;
  checkAvailability(medicoId: string, fecha: Date, duracion: number): Promise<boolean>;
}

export interface IConsultasMedicasService {
  createConsultasMedicas(consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas; message: string }>;
  findConsultasMedicas(query?: Query): Promise<ConsultasMedicas[]>;
  findConsultasMedicasById(id: string): Promise<ConsultasMedicas | null>;
  findConsultasMedicasByPaciente(pacienteId: string): Promise<ConsultasMedicas[]>;
  updateConsultasMedicas(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas | null; message: string }>;
  deleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  concludeConsulta(id: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
  deriveConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
  reassignConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
  addRecetaToConsulta(id: string, recetaData: Partial<RecetasMedicamentos>): Promise<{ consulta: ConsultasMedicas; message: string }>;
  addExamenToConsulta(id: string, examenData: Partial<PacienteExamen>): Promise<{ consulta: ConsultasMedicas; message: string }>;
  generateReporte(id: string, tipo: "receta" | "examen" | "ampliacion"): Promise<{ reporte: any; message: string }>;
}