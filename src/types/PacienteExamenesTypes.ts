import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Paciente } from "types/PacientesTypes";
import { ExamenesMedicos } from "types/ExamenesMedicosTypes";

export interface PacienteExamenes extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente; // Relación con Paciente
  examen: Types.ObjectId | ExamenesMedicos; // Relación con ExamenesMedicos
  fecha: Date; // Fecha del examen
  resultado: string; // Resultado del examen
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IPacienteExamenesRepository extends Repository<PacienteExamenes> {
  findOne(query: Query): Promise<PacienteExamenes | null>;
  findActive(query?: Query): Promise<PacienteExamenes[]>; // Method to find only active registros
}

export interface IPacienteExamenesService {
  createPacienteExamenes(pacienteExamen: PacienteExamenes): Promise<{ pacienteExamen: PacienteExamenes; message: string }>;
  findPacienteExamenes(query?: Query): Promise<PacienteExamenes[]>;
  findPacienteExamenesById(id: string): Promise<PacienteExamenes | null>;
  findPacienteExamenesByPaciente(pacienteId: string): Promise<PacienteExamenes[]>;
  updatePacienteExamenes(id: string, pacienteExamen: Partial<PacienteExamenes>): Promise<{ pacienteExamen: PacienteExamenes | null; message: string }>;
  deletePacienteExamenes(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePacienteExamenes(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}