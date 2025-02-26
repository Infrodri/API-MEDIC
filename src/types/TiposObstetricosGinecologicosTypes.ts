import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface TiposObstetricosGinecologicos extends Document {
  getBasicInfo(): any;
  nombreTipo: string; // Nombre del tipo obstétrico/ginecológico
  descripcion: string; // Descripción del tipo
  estado: "Activo" | "Inactivo"; // Status for logical deletion
}

export interface ITiposObstetricosGinecologicosRepository extends Repository<TiposObstetricosGinecologicos> {
  findOne(query: Query): Promise<TiposObstetricosGinecologicos | null>;
  findActive(query?: Query): Promise<TiposObstetricosGinecologicos[]>; // Method to find only active tipos
}

export interface ITiposObstetricosGinecologicosService {
  createTiposObstetricosGinecologicos(tipos: TiposObstetricosGinecologicos): Promise<{ tipos: TiposObstetricosGinecologicos; message: string }>;
  findTiposObstetricosGinecologicos(query?: Query): Promise<TiposObstetricosGinecologicos[]>;
  findTiposObstetricosGinecologicosById(id: string): Promise<TiposObstetricosGinecologicos | null>;
  findTiposObstetricosGinecologicosByNombre(nombreTipo: string): Promise<TiposObstetricosGinecologicos | null>;
  updateTiposObstetricosGinecologicos(id: string, tipos: Partial<TiposObstetricosGinecologicos>): Promise<{ tipos: TiposObstetricosGinecologicos | null; message: string }>;
  deleteTiposObstetricosGinecologicos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteTiposObstetricosGinecologicos(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}