// src/types/FichasMedicasTypes.ts
import { Document, Types } from "mongoose";
import { Repository } from "./RepositoryTypes";
import { Paciente } from "./PacientesTypes";
import { AntecedentesPersonales } from "./AntecedentesPersonalesTypes";
import { AntecedentesFamiliares } from "./AntecedentesFamiliaresTypes";
import { PacienteOperacion } from "./PacienteOperacionesTypes";
import { PacienteObstetricoGinecologico } from "./PacienteObstetricosGinecologicosTypes";
import { PacienteAdiccion } from "./PacienteAdiccionesTypes";
import { ExploracionFisica } from "./ExploracionFisicaTypes";
import { ExamenNeurologico } from "./ExamenNeurologicoTypes";
import { OrganosSentidos } from "./OrganosSentidosTypes";
import { ConsultasMedicas } from "./ConsultasMedicasTypes";

export interface FichasMedicas extends Document {
  getBasicInfo(): any;
  paciente: Types.ObjectId | Paciente;
  antecedentesPersonales?: Types.ObjectId | AntecedentesPersonales;
  antecedentesFamiliares?: Types.ObjectId | AntecedentesFamiliares;
  operacionesQuirurgicas: (Types.ObjectId | PacienteOperacion)[];
  ginecologiaObstetrica: (Types.ObjectId | PacienteObstetricoGinecologico)[];
  adicciones: (Types.ObjectId | PacienteAdiccion)[];
  exploracionFisica?: Types.ObjectId | ExploracionFisica;
  examenNeurologico?: Types.ObjectId | ExamenNeurologico;
  organosSentidos?: Types.ObjectId | OrganosSentidos;
  consultasMedicas: (Types.ObjectId | ConsultasMedicas)[];
  estado: "Activo" | "Inactivo";
}

export interface IFichasMedicasRepository extends Repository<FichasMedicas> {
  findByPaciente(pacienteId: string): Promise<FichasMedicas | null>;
  findWithPagination(query: any, skip: number, limit: number): Promise<FichasMedicas[]>;
}

export interface IFichasMedicasService {
  listFichas(page?: number, limit?: number, estado?: "Activo" | "Inactivo"): Promise<{ fichas: FichasMedicas[]; total: number }>; // Nuevo método
  getFichaByPaciente(pacienteId: string): Promise<FichasMedicas | null>;
  createFicha(pacienteId: string): Promise<{ ficha: FichasMedicas; message: string }>;
  updateFicha(id: string, data: Partial<FichasMedicas>): Promise<{ ficha: FichasMedicas | null; message: string }>;
  softDeleteFicha(id: string): Promise<{ success: boolean; message: string }>;
  addAntecedentesPersonales(pacienteId: string, data: Partial<AntecedentesPersonales>): Promise<{ antecedentes: AntecedentesPersonales; message: string }>;
  addAntecedentesFamiliares(pacienteId: string, data: Partial<AntecedentesFamiliares>): Promise<{ antecedentes: AntecedentesFamiliares; message: string }>;
  addOperacionQuirurgica(pacienteId: string, data: Partial<PacienteOperacion>): Promise<{ operacion: PacienteOperacion; message: string }>;
  addGinecologiaObstetrica(pacienteId: string, data: Partial<PacienteObstetricoGinecologico>): Promise<{ ginecologia: PacienteObstetricoGinecologico; message: string }>;
  addAdiccion(pacienteId: string, data: Partial<PacienteAdiccion>): Promise<{ adiccion: PacienteAdiccion; message: string }>;
  addExploracionFisica(pacienteId: string, data: Partial<ExploracionFisica>): Promise<{ exploracion: ExploracionFisica; message: string }>;
  addExamenNeurologico(pacienteId: string, data: Partial<ExamenNeurologico>): Promise<{ examen: ExamenNeurologico; message: string }>;
  addOrganosSentidos(pacienteId: string, data: Partial<OrganosSentidos>): Promise<{ organos: OrganosSentidos; message: string }>;
  addConsultaMedica(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas; message: string }>;
  generateReporte(id: string): Promise<any>;
}