// src/types/ConsultasMedicasTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Medico } from "types/MedicoTypes";
import { Paciente } from "types/PacientesTypes";
import { FichasMedicas } from "types/FichasMedicasTypes";
import { Especialidades } from "./EspecialidadesTypes";

export interface ConsultasMedicas extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  medico: Types.ObjectId | Medico;
  fichaMedica: Types.ObjectId | FichasMedicas;
  especialidad: Types.ObjectId | Especialidades;
  fecha: Date;
  motivo: string;
  observaciones: string;
  estado: "Activo" | "Inactivo";
  estadoConsulta: "Pendiente" | "Concluida" | "Derivada"; // Nuevo campo
  medicoDerivado?: Types.ObjectId | Medico; // Nuevo campo para derivaciones
}

export interface IConsultasMedicasRepository extends Repository<ConsultasMedicas> {
  findOne(query: Query): Promise<ConsultasMedicas | null>;
  findActive(query?: Query): Promise<ConsultasMedicas[]>;
}

export interface IConsultasMedicasService {
  createConsultasMedicas(consulta: ConsultasMedicas): Promise<{ consulta: ConsultasMedicas; message: string }>;
  findConsultasMedicas(query?: Query): Promise<ConsultasMedicas[]>;
  findConsultasMedicasById(id: string): Promise<ConsultasMedicas | null>;
  findConsultasMedicasByPaciente(pacienteId: string): Promise<ConsultasMedicas[]>;
  updateConsultasMedicas(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas | null; message: string }>;
  deleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  concludeConsulta(id: string): Promise<{ consulta: ConsultasMedicas; message: string }>; // Ajustado
  deriveConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
  reassignConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }>;
}