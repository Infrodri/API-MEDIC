import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";
import { Medicamentos } from "./MedicamentosTypes";

export interface RecetasMedicas extends Document {
  getBasicInfo(): any;
  consulta: Types.ObjectId | ConsultasMedicas; // Relación con ConsultaMedica
  medicamentos: (Types.ObjectId | Medicamentos)[]; // Relación con Medicamentos (array de referencias)
  fechaEmision: Date; // Fecha de emisión de la receta
  instrucciones: string; // Instrucciones de la receta
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface IRecetasMedicasRepository extends Repository<RecetasMedicas> {
  findOne(query: Query): Promise<RecetasMedicas | null>;
  findActive(query?: Query): Promise<RecetasMedicas[]>; // Method to find only active recetas
}

export interface IRecetasMedicasService {
  createRecetasMedicas(receta: RecetasMedicas): Promise<{ receta: RecetasMedicas; message: string }>;
  findRecetasMedicas(query?: Query): Promise<RecetasMedicas[]>;
  findRecetasMedicasById(id: string): Promise<RecetasMedicas | null>;
  findRecetasMedicasByConsulta(consultaId: string): Promise<RecetasMedicas[]>;
  updateRecetasMedicas(id: string, receta: Partial<RecetasMedicas>): Promise<{ receta: RecetasMedicas | null; message: string }>;
  deleteRecetasMedicas(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteRecetasMedicas(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}