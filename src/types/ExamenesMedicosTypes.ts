// src/types/ExamenesMedicosTypes.ts
import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface ExamenesMedicos extends Document {
  getBasicInfo(): any;
  nombre: string; // Nombre del tipo de examen médico (ej. "Análisis de sangre")
  descripcion?: string; // Descripción opcional del tipo de examen
  estado: "Activo" | "Inactivo"; // Estado para eliminación suave
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExamenesMedicosRepository extends Repository<ExamenesMedicos> {
  findOne(query: Query): Promise<ExamenesMedicos | null>;
  findActive(query?: Query): Promise<ExamenesMedicos[]>;
}

export interface IExamenesMedicosService {
  createExamenesMedicos(examen: ExamenesMedicos): Promise<{ examen: ExamenesMedicos; message: string }>;
  findExamenesMedicos(query?: Query): Promise<ExamenesMedicos[]>;
  findExamenesMedicosById(id: string): Promise<ExamenesMedicos | null>;
  findExamenesMedicosByNombre(nombre: string): Promise<ExamenesMedicos | null>;
  updateExamenesMedicos(id: string, examen: Partial<ExamenesMedicos>): Promise<{ examen: ExamenesMedicos | null; message: string }>;
  deleteExamenesMedicos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteExamenesMedicos(id: string): Promise<{ success: boolean; message: string }>;
}