import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface TiposAdiccion extends Document {
  getBasicInfo(): any;
  nombreAdiccion: string; // Nombre de la adicción
  descripcion: string; // Descripción de la adicción
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface ITiposAdiccionRepository extends Repository<TiposAdiccion> {
  findOne(query: Query): Promise<TiposAdiccion | null>;
  findActive(query?: Query): Promise<TiposAdiccion[]>; // Method to find only active tipos de adicciones
}

export interface ITiposAdiccionService {
  createTiposAdiccion(tiposAdiccion: TiposAdiccion): Promise<{ tiposAdiccion: TiposAdiccion; message: string }>;
  findTiposAdicciones(query?: Query): Promise<TiposAdiccion[]>;
  findTiposAdiccionById(id: string): Promise<TiposAdiccion | null>;
  findTiposAdiccionByNombre(nombreAdiccion: string): Promise<TiposAdiccion | null>;
  updateTiposAdiccion(id: string, tiposAdiccion: Partial<TiposAdiccion>): Promise<{ tiposAdiccion: TiposAdiccion | null; message: string }>;
  deleteTiposAdiccion(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteTiposAdiccion(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}