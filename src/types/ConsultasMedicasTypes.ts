import { Document, Types } from "mongoose";
import { Medico } from "./MedicoTypes";
import { Paciente } from "./PacientesTypes";
import { RecetasMedicamentos } from "./RecetasMedicamentosTypes";
import { PacienteExamen } from "./PacienteExamenesTypes";
import { Especialidades } from "./EspecialidadesTypes";
import { Query } from "./RepositoryTypes";

export interface ConsultasMedicas extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  medico: Types.ObjectId | Medico;
  especialidad: Types.ObjectId | Especialidades;
  fecha: Date;
  motivo: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  recomendacionDescanso?: string;
  estado: "Activo" | "Inactivo";
  estadoConsulta: "Pendiente" | "Concluida" | "Derivada" | "Cancelada";
  medicoDerivado?: Types.ObjectId | Medico;
  prioridad: "Normal" | "Alta" | "Urgente";
  duracion: number;
  recetas: (Types.ObjectId | RecetasMedicamentos)[];
  examenes: (Types.ObjectId | PacienteExamen)[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PopulatedConsultasMedicas extends Omit<ConsultasMedicas, "paciente" | "medico" | "especialidad" | "medicoDerivado" | "recetas" | "examenes"> {
  paciente: Paciente;
  medico: Medico;
  especialidad: Especialidades;
  medicoDerivado?: Medico;
  recetas: RecetasMedicamentos[];
  examenes: PacienteExamen[];
}

export interface IConsultasMedicasRepository {
  create(data: ConsultasMedicas): Promise<ConsultasMedicas>;
  find(query?: Query): Promise<ConsultasMedicas[]>;
  findActive(query?: Query): Promise<ConsultasMedicas[]>;
  findOne(query: Query): Promise<ConsultasMedicas | null>;
  findById(id: string): Promise<ConsultasMedicas | null>;
  update(id: string, data: Partial<ConsultasMedicas>): Promise<ConsultasMedicas | null>;
  delete(id: string): Promise<boolean>;
  checkAvailability(medicoId: string, fecha: Date, duracion: number): Promise<boolean>;
  countByEspecialidad(especialidadId: string): Promise<number>;
  countByMedico(medicoId: string): Promise<number>;
  countByPaciente(pacienteId: string): Promise<number>;
}

export interface IConsultasMedicasService {
  createConsultasMedicas(consultaData: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas; message: string }>;
  findConsultasMedicas(query?: Query): Promise<ConsultasMedicas[]>;
  findConsultasMedicasById(id: string): Promise<ConsultasMedicas | null>;
  findConsultasMedicasByPaciente(pacienteId: string): Promise<ConsultasMedicas[]>;
  updateConsultasMedicas(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas | null; message: string }>;
  deleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  concludeConsulta(id: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
  deriveConsultaMedica(id: string, medicoId: string, nuevaEspecialidadId: string, nuevaFecha?: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
  reassignConsultaMedica(id: string, medicoId: string, nuevaFecha?: string, nuevaPrioridad?: "Normal" | "Alta" | "Urgente"): Promise<{ consulta: ConsultasMedicas; message: string }>;
  addRecetaToConsulta(id: string, recetaData: Partial<RecetasMedicamentos>): Promise<{ consulta: ConsultasMedicas; message: string }>;
  addExamenToConsulta(id: string, examenData: Partial<PacienteExamen>): Promise<{ consulta: ConsultasMedicas; message: string }>;
  generateReporte(id: string, tipo: "receta" | "examen" | "ampliacion"): Promise<{ reporte: any; message: string }>;
  countConsultasByEspecialidad(especialidadId: string): Promise<number>;
  countConsultasByMedico(medicoId: string): Promise<number>;
  countConsultasByPaciente(pacienteId: string): Promise<number>;
  getAvailableSlots(medicoId: string, date: string): Promise<string[]>;
}