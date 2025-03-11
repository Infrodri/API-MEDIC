// src/types/ConsultasMedicasTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Medico } from "types/MedicoTypes";
import { Paciente } from "types/PacientesTypes";
import { FichasMedicas } from "types/FichasMedicasTypes";
import { Especialidades } from "./EspecialidadesTypes";

export interface ConsultasMedicas extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId |Paciente;
  medico: Types.ObjectId | Medico;
  fecha: Date;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
  estado: "Activo" | "Inactivo";
  estadoConsulta: "Pendiente" | "Concluida" | "Derivada" | "Cancelada"; // Agregado "Cancelada"
  medicoDerivado?: Types.ObjectId | Medico;
  prioridad: "Normal" | "Alta" | "Urgente";
  duracion: number; // Nuevo campo para citas
}

export interface IConsultasMedicasRepository extends Repository<ConsultasMedicas> {
  findOne(query: Query): Promise<ConsultasMedicas | null>;
  findActive(query?: Query): Promise<ConsultasMedicas[]>;
  checkAvailability(medicoId: string, fecha: Date, duracion: number): Promise<boolean>; // Nuevo método
}

export interface IConsultasMedicasService {
  findCitasProgramadas(): unknown;
  createConsultasMedicas(consulta: ConsultasMedicas): Promise<{ consulta: ConsultasMedicas; message: string }>;
  findConsultasMedicas(query?: Query): Promise<ConsultasMedicas[]>;
  findConsultasMedicasById(id: string): Promise<ConsultasMedicas | null>;
  findConsultasMedicasByPaciente(pacienteId: string): Promise<ConsultasMedicas[]>;
  updateConsultasMedicas(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas | null; message: string }>;
  deleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  concludeConsulta(id: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
  deriveConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
  reassignConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
}