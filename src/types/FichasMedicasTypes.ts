// src/types/FichasMedicasTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Medico } from "types/MedicoTypes";
import { Especialidades } from "types/EspecialidadesTypes";
import { Paciente } from "./PacientesTypes";

export interface FichasMedicas extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  medico: Types.ObjectId | Medico;
  especialidad: Types.ObjectId | Especialidades;
  fecha: Date;
  diagnostico: string;
  estado: "Activo" | "Inactivo";
}

export interface IFichasMedicasRepository extends Repository<FichasMedicas> {
  findOne(query: Query): Promise<FichasMedicas | null>;
  findActive(query?: Query): Promise<FichasMedicas[]>;
  findByPaciente(pacienteId: string): Promise<FichasMedicas[]>;
}

export interface IFichasMedicasService {
  createFichaMedica(ficha: Omit<FichasMedicas, keyof Document>): Promise<{ ficha: FichasMedicas; message: string }>;
  findFichasMedicas(query?: Query): Promise<FichasMedicas[]>;
  findFichaMedicaById(id: string): Promise<FichasMedicas | null>;
  findFichasMedicasByPaciente(pacienteId: string): Promise<FichasMedicas[]>;
  updateFichaMedica(id: string, ficha: Partial<FichasMedicas>): Promise<{ ficha: FichasMedicas | null; message: string }>;
  deleteFichaMedica(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteFichaMedica(id: string): Promise<{ success: boolean; message: string }>;
}