import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Medico } from "types/MedicoTypes";
import { Paciente } from "types/PacientesTypes";

export interface ExamenesMedicos extends Document {
  getBasicInfo(): any;
  nombreExamen: string; // Nombre del examen médico
  descripcion: string; // Descripción del examen
  medico: Types.ObjectId | Medico; // Relación con Medico que realiza/prescribe el examen
  paciente: Types.ObjectId | Paciente; // Relación con Paciente al que se le realiza el examen
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IExamenesMedicosRepository extends Repository<ExamenesMedicos> {
  findOne(query: Query): Promise<ExamenesMedicos | null>;
  findActive(query?: Query): Promise<ExamenesMedicos[]>; // Method to find only active exámenes médicos
}

export interface IExamenesMedicosService {
  createExamenesMedicos(examen: ExamenesMedicos): Promise<{ examen: ExamenesMedicos; message: string }>;
  findExamenesMedicos(query?: Query): Promise<ExamenesMedicos[]>;
  findExamenesMedicosById(id: string): Promise<ExamenesMedicos | null>;
  findExamenesMedicosByNombre(nombreExamen: string): Promise<ExamenesMedicos | null>;
  updateExamenesMedicos(id: string, examen: Partial<ExamenesMedicos>): Promise<{ examen: ExamenesMedicos | null; message: string }>;
  deleteExamenesMedicos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteExamenesMedicos(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}