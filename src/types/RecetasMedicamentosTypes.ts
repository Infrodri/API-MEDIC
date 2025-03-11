// src/types/RecetasMedicamentosTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { Medicamentos } from "types/MedicamentosTypes";

export interface RecetasMedicamentos extends Document {
  getBasicInfo(): any;
  consulta: Types.ObjectId | string;
  medico: Types.ObjectId | string;
  medicamento: Types.ObjectId | Medicamentos;
  dosis: string;
  duracion: string;
  instrucciones?: string;
  estado: "Activo" | "Inactivo";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRecetasMedicamentosRepository extends Repository<RecetasMedicamentos> {
  findOne(query: Query): Promise<RecetasMedicamentos | null>;
  findActive(query?: Query): Promise<RecetasMedicamentos[]>;
}

export interface IRecetasMedicamentosService {
  createRecetasMedicamentos(recetaMedicamento: RecetasMedicamentos): Promise<{ recetaMedicamento: RecetasMedicamentos; message: string }>;
  findRecetasMedicamentos(query?: Query): Promise<RecetasMedicamentos[]>;
  findRecetasMedicamentosById(id: string): Promise<RecetasMedicamentos | null>;
  findRecetasMedicamentosByReceta(consultaId: string): Promise<RecetasMedicamentos[]>;
  updateRecetasMedicamentos(id: string, recetaMedicamento: Partial<RecetasMedicamentos>): Promise<{ recetaMedicamento: RecetasMedicamentos | null; message: string }>;
  deleteRecetasMedicamentos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteRecetasMedicamentos(id: string): Promise<{ success: boolean; message: string }>;
}