import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface Medicamentos extends Document {
  getBasicInfo(): any;
  nombreMedicamento: string; // Nombre del medicamento
  descripcion: string; // Descripción del medicamento
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IMedicamentosRepository extends Repository<Medicamentos> {
  findOne(query: Query): Promise<Medicamentos | null>;
  findActive(query?: Query): Promise<Medicamentos[]>; // Method to find only active medicamentos
}

export interface IMedicamentosService {
  createMedicamentos(medicamento: Medicamentos): Promise<{ medicamento: Medicamentos; message: string }>;
  findMedicamentos(query?: Query): Promise<Medicamentos[]>;
  findMedicamentosById(id: string): Promise<Medicamentos | null>;
  findMedicamentosByNombre(nombreMedicamento: string): Promise<Medicamentos | null>;
  updateMedicamentos(id: string, medicamento: Partial<Medicamentos>): Promise<{ medicamento: Medicamentos | null; message: string }>;
  deleteMedicamentos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteMedicamentos(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}