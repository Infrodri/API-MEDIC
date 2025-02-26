import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface TiposOperacionesQuirurgicas extends Document {
  getBasicInfo(): any;
  nombreOperacion: string; // Nombre de la operación quirúrgica
  descripcion: string; // Descripción de la operación
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface ITiposOperacionesQuirurgicasRepository extends Repository<TiposOperacionesQuirurgicas> {
  findOne(query: Query): Promise<TiposOperacionesQuirurgicas | null>;
  findActive(query?: Query): Promise<TiposOperacionesQuirurgicas[]>; // Method to find only active tipos de operaciones
}

export interface ITiposOperacionesQuirurgicasService {
  createTiposOperacionesQuirurgicas(tipos: TiposOperacionesQuirurgicas): Promise<{ tipos: TiposOperacionesQuirurgicas; message: string }>;
  findTiposOperacionesQuirurgicas(query?: Query): Promise<TiposOperacionesQuirurgicas[]>;
  findTiposOperacionesQuirurgicasById(id: string): Promise<TiposOperacionesQuirurgicas | null>;
  findTiposOperacionesQuirurgicasByNombre(nombreOperacion: string): Promise<TiposOperacionesQuirurgicas | null>;
  updateTiposOperacionesQuirurgicas(id: string, tipos: Partial<TiposOperacionesQuirurgicas>): Promise<{ tipos: TiposOperacionesQuirurgicas | null; message: string }>;
  deleteTiposOperacionesQuirurgicas(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteTiposOperacionesQuirurgicas(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}