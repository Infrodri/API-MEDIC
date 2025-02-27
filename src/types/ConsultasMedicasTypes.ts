import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Medico } from "types/MedicoTypes";
import { Paciente } from "types/PacientesTypes";
import { FichasMedicas } from "types/FichasMedicasTypes";
import { Especialidades } from "./EspecialidadesTypes";

export interface ConsultasMedicas extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente; // Relación con Paciente
  medico: Types.ObjectId | Medico; // Relación con Medico
  fichaMedica: Types.ObjectId | FichasMedicas; // Relación con FichaMedica
  especialidad: Types.ObjectId | Especialidades; // Nueva relación con Especialidades
  fecha: Date; // Fecha de la consulta
  motivo: string; // Motivo de la consulta
  observaciones: string; // Observaciones de la consulta
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IConsultasMedicasRepository extends Repository<ConsultasMedicas> {
  findOne(query: Query): Promise<ConsultasMedicas | null>;
  findActive(query?: Query): Promise<ConsultasMedicas[]>; // Method to find only active consultas
}

export interface IConsultasMedicasService {
  concludeConsulta(id: string, medicoId: any): { success: any; message: any; } | PromiseLike<{ success: any; message: any; }>;
  createConsultasMedicas(consulta: ConsultasMedicas): Promise<{ consulta: ConsultasMedicas; message: string }>;
  findConsultasMedicas(query?: Query): Promise<ConsultasMedicas[]>;
  findConsultasMedicasById(id: string): Promise<ConsultasMedicas | null>;
  findConsultasMedicasByPaciente(pacienteId: string): Promise<ConsultasMedicas[]>;
  updateConsultasMedicas(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas | null; message: string }>;
  deleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}