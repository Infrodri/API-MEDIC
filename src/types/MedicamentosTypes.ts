// src/types/MedicamentosTypes.ts
import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface Medicamentos extends Document {
  getBasicInfo(): any;
  nombre: string;
  descripcion?: string;
  esCritico: boolean; // Ajustado a Boolean para coincidir con FichasMedicasTypes.ts
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMedicamentosRepository extends Repository<Medicamentos> {
  findOne(query: Query): Promise<Medicamentos | null>;
  findActive(query?: Query): Promise<Medicamentos[]>; // Mantendremos este método por ahora
}

export interface IMedicamentosService {
  createMedicamentos(medicamento: Medicamentos): Promise<{ medicamento: Medicamentos; message: string }>;
  findMedicamentos(query?: Query): Promise<Medicamentos[]>;
  findMedicamentosById(id: string): Promise<Medicamentos | null>;
  findMedicamentosByNombre(nombre: string): Promise<Medicamentos | null>;
  updateMedicamentos(id: string, medicamento: Partial<Medicamentos>): Promise<{ medicamento: Medicamentos | null; message: string }>;
  deleteMedicamentos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteMedicamentos(id: string): Promise<{ success: boolean; message: string }>;
}