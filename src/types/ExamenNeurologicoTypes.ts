import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface ExamenNeurologico extends Document {
  paciente: Types.ObjectId; // Referencia al modelo Paciente
  reflejos: string;        // Descripción de los reflejos
  fuerzaMuscular: string;  // Nivel de fuerza muscular
  sensibilidad: string;    // Evaluación de la sensibilidad
  estado: "Activo" | "Inactivo"; // Estado para eliminación lógica
}

export interface IExamenNeurologicoRepository extends Repository<ExamenNeurologico> {
  findOne(query: Query): Promise<ExamenNeurologico | null>;
  findActive(query?: Query): Promise<ExamenNeurologico[]>;
}

export interface IExamenNeurologicoService {
  createExamenNeurologico(examen: Omit<ExamenNeurologico, keyof Document>): Promise<{ examen: ExamenNeurologico; message: string }>;
  findExamenNeurologico(query?: Query): Promise<ExamenNeurologico[]>;
  findExamenNeurologicoById(id: string): Promise<ExamenNeurologico | null>;
  updateExamenNeurologico(id: string, examen: Partial<ExamenNeurologico>): Promise<{ examen: ExamenNeurologico | null; message: string }>;
  deleteExamenNeurologico(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteExamenNeurologico(id: string): Promise<{ success: boolean; message: string }>;
}