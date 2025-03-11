import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface OrganosSentidos extends Document {
  paciente: Types.ObjectId; // Referencia al modelo Paciente
  vision: string;          // Evaluación de la visión
  audicion: string;        // Evaluación de la audición
  olfato: string;          // Evaluación del olfato
  gusto: string;           // Evaluación del gusto
  tacto: string;           // Evaluación del tacto
  estado: "Activo" | "Inactivo"; // Estado para eliminación lógica
}

export interface IOrganosSentidosRepository extends Repository<OrganosSentidos> {
  findOne(query: Query): Promise<OrganosSentidos | null>;
  findActive(query?: Query): Promise<OrganosSentidos[]>;
}

export interface IOrganosSentidosService {
  createOrganosSentidos(organo: Omit<OrganosSentidos, keyof Document>): Promise<{ organo: OrganosSentidos; message: string }>;
  findOrganosSentidos(query?: Query): Promise<OrganosSentidos[]>;
  findOrganosSentidosById(id: string): Promise<OrganosSentidos | null>;
  updateOrganosSentidos(id: string, organo: Partial<OrganosSentidos>): Promise<{ organo: OrganosSentidos | null; message: string }>;
  deleteOrganosSentidos(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteOrganosSentidos(id: string): Promise<{ success: boolean; message: string }>;
}