import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface ExploracionFisica extends Document {
  paciente: Types.ObjectId; // Referencia al modelo Paciente
  temperatura: number;      // °C
  tensionArterial: string;  // mm/Hg (ej. "120/80")
  frecuenciaCardiaca: number; // Latidos por minuto
  peso: number;            // KG
  talla: number;           // CM
  frecuenciaRespiratoria: number; // Respiraciones por minuto
  examenFisico: {
    piel?: string;
    cabeza?: string;
    cara?: string;
    cardioPulmonar?: string;
    abdomen?: string;
    extremidades?: string;
    boca?: string;
    torax?: string;
    cuello?: string;
  };
  estado: "Activo" | "Inactivo"; // Estado para eliminación lógica
}

export interface IExploracionFisicaRepository extends Repository<ExploracionFisica> {
  findOne(query: Query): Promise<ExploracionFisica | null>;
  findActive(query?: Query): Promise<ExploracionFisica[]>;
}

export interface IExploracionFisicaService {
  createExploracionFisica(exploracion: Omit<ExploracionFisica, keyof Document>): Promise<{ exploracion: ExploracionFisica; message: string }>;
  findExploracionFisica(query?: Query): Promise<ExploracionFisica[]>;
  findExploracionFisicaById(id: string): Promise<ExploracionFisica | null>;
  updateExploracionFisica(id: string, exploracion: Partial<ExploracionFisica>): Promise<{ exploracion: ExploracionFisica | null; message: string }>;
  deleteExploracionFisica(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteExploracionFisica(id: string): Promise<{ success: boolean; message: string }>;
}