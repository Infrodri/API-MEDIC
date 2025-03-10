// src/types/PacienteObstetricosGinecologicosTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "./PacientesTypes";
import { TiposObstetricosGinecologicos } from "./TiposObstetricosGinecologicosTypes";

export interface PacienteObstetricoGinecologico extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  tipoObstetricoGinecologico: Types.ObjectId | TiposObstetricosGinecologicos;
  embarazos: string;
  partos: string;
  abortos: string;
  cesareas: string;
  menarca: string;
  cicloMenstrual: string;
  fechaEvento: Date;
  observaciones: string;
  estado: "Activo" | "Inactivo";
}

export interface IPacienteObstetricoGinecologicoRepository extends Repository<PacienteObstetricoGinecologico> {
  findOne(query: Query): Promise<PacienteObstetricoGinecologico | null>;
  findActive(query?: Query): Promise<PacienteObstetricoGinecologico[]>;
  findByPaciente(pacienteId: string): Promise<PacienteObstetricoGinecologico[]>;
}

export interface IPacienteObstetricoGinecologicoService {
  createPacienteObstetricoGinecologico(pacienteObstetricoGinecologico: PacienteObstetricoGinecologico): Promise<{ pacienteObstetricoGinecologico: PacienteObstetricoGinecologico; message: string }>;
  findPacienteObstetricosGinecologicos(query?: Query): Promise<PacienteObstetricoGinecologico[]>;
  findPacienteObstetricoGinecologicoById(id: string): Promise<PacienteObstetricoGinecologico | null>;
  findPacienteObstetricosGinecologicosByPaciente(pacienteId: string): Promise<PacienteObstetricoGinecologico[]>;
  updatePacienteObstetricoGinecologico(id: string, pacienteObstetricoGinecologico: Partial<PacienteObstetricoGinecologico>): Promise<{ pacienteObstetricoGinecologico: PacienteObstetricoGinecologico | null; message: string }>;
  deletePacienteObstetricoGinecologico(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteObstetricoGinecologico(id: string): Promise<{ success: boolean; message: string }>;
}