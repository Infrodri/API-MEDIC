import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { RecetasMedicas } from "types/RecetasMedicasTypes";
import { Medicamentos } from "types/MedicamentosTypes";

export interface RecetasMedicamentos extends Document {
  getBasicInfo(): any;
  receta: Types.ObjectId | RecetasMedicas; // Relación con RecetasMedicas
  medicamento: Types.ObjectId | Medicamentos; // Relación con Medicamentos
  dosis: string; // Dosis del medicamento
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IRecetasMedicamentosRepository extends Repository<RecetasMedicamentos> {
  findOne(query: Query): Promise<RecetasMedicamentos | null>;
  findActive(query?: Query): Promise<RecetasMedicamentos[]>; // Method to find only active registros
}

export interface IRecetasMedicamentosService {
  createRecetasMedicamentos(recetaMedicamento: RecetasMedicamentos): Promise<{ recetaMedicamento: RecetasMedicamentos; message: string }>;
  findRecetasMedicamentos(query?: Query): Promise<RecetasMedicamentos[]>;
  findRecetasMedicamentosById(id: string): Promise<RecetasMedicamentos | null>;
  findRecetasMedicamentosByReceta(recetaId: string): Promise<RecetasMedicamentos[]>;
  updateRecetasMedicamentos(id: string, recetaMedicamento: Partial<RecetasMedicamentos>): Promise<{ recetaMedicamento: RecetasMedicamentos | null; message: string }>;
  deleteRecetasMedicamentos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteRecetasMedicamentos(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}