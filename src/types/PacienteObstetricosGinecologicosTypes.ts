import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "types/PacientesTypes";
import { TiposObstetricosGinecologicos } from "types/TiposObstetricosGinecologicosTypes";

export interface PacienteObstetricosGinecologicos extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente; // Relación con Paciente
  tipoObstetricoGinecologico: Types.ObjectId | TiposObstetricosGinecologicos; // Relación con TiposObstetricosGinecologicos
  fecha: Date; // Fecha del registro
  observaciones: string; // Observaciones relacionadas
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IPacienteObstetricosGinecologicosRepository extends Repository<PacienteObstetricosGinecologicos> {
  findOne(query: Query): Promise<PacienteObstetricosGinecologicos | null>;
  findActive(query?: Query): Promise<PacienteObstetricosGinecologicos[]>; // Method to find only active registros
}

export interface IPacienteObstetricosGinecologicosService {
  createPacienteObstetricosGinecologicos(pacienteOG: PacienteObstetricosGinecologicos): Promise<{ pacienteOG: PacienteObstetricosGinecologicos; message: string }>;
  findPacienteObstetricosGinecologicos(query?: Query): Promise<PacienteObstetricosGinecologicos[]>;
  findPacienteObstetricosGinecologicosById(id: string): Promise<PacienteObstetricosGinecologicos | null>;
  findPacienteObstetricosGinecologicosByPaciente(pacienteId: string): Promise<PacienteObstetricosGinecologicos[]>;
  updatePacienteObstetricosGinecologicos(id: string, pacienteOG: Partial<PacienteObstetricosGinecologicos>): Promise<{ pacienteOG: PacienteObstetricosGinecologicos | null; message: string }>;
  deletePacienteObstetricosGinecologicos(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteObstetricosGinecologicos(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}