import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface AntecedentesFamiliares extends Document {
  paciente: Types.ObjectId;
  antecedentesFamiliares: string;
  estado: "Activo" | "Inactivo";
}

export interface IAntecedentesFamiliaresRepository extends Repository<AntecedentesFamiliares> {
  findOne(query: Query): Promise<AntecedentesFamiliares | null>;
  findActive(query?: Query): Promise<AntecedentesFamiliares[]>;
}

export interface IAntecedentesFamiliaresService {
  createAntecedentesFamiliares(antecedente: Omit<AntecedentesFamiliares, keyof Document>): Promise<{ antecedente: AntecedentesFamiliares; message: string }>;
  findAntecedentesFamiliares(query?: Query): Promise<AntecedentesFamiliares[]>;
  findAntecedentesFamiliaresById(id: string): Promise<AntecedentesFamiliares | null>;
  updateAntecedentesFamiliares(id: string, antecedente: Partial<AntecedentesFamiliares>): Promise<{ antecedente: AntecedentesFamiliares | null; message: string }>;
  deleteAntecedentesFamiliares(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteAntecedentesFamiliares(id: string): Promise<{ success: boolean; message: string }>;
}