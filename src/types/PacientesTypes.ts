// src/types/PacienteTypes.ts
import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";
import { PacienteAdiccion } from "types/PacienteAdiccionesTypes";
import { PacienteExamen } from "types/PacienteExamenesTypes";
import { PacienteObstetricoGinecologico } from "types/PacienteObstetricosGinecologicosTypes";
import { PacienteOperacion } from "types/PacienteOperacionesTypes";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";

export interface Paciente extends Document {
  getBasicInfo(): any;
  cedula?: string; // Opcional, pero sugerido como identificador único
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: Date;
  direccion: string;
  telefono: string;
  celular: string;
  genero: string;
  estado: "Activo" | "Inactivo";
  estadoAtencion: "Pendiente" | "Atendido" | "Derivado";
}

export interface HistorialMedico {
  paciente: Paciente[];
  adicciones: PacienteAdiccion[];
  examenes: PacienteExamen[];
  obstetricosGinecologicos: PacienteObstetricoGinecologico[];
  operaciones: PacienteOperacion[];
  consultas: ConsultasMedicas[];
}

export interface IPacienteRepository extends Repository<Paciente> {
  findOne(query: Query): Promise<Paciente | null>;
  findActive(query?: Query): Promise<Paciente[]>;
  findByEstadoAtencion(estado: string): Promise<Paciente[]>;
  findByIdentifier(identifier: string): Promise<Paciente | null>; // Nuevo método
}

export interface IPacienteService {
  createPaciente(paciente: Paciente): Promise<{ paciente: Paciente; message: string }>;
  findPacientes(query?: Query): Promise<Paciente[]>;
  findPacienteById(id: string): Promise<Paciente | null>;
  findPacientesByEstadoAtencion(estado: string): Promise<Paciente[]>;
  findPacienteByIdentifier(identifier: string): Promise<Paciente | null>; // Nuevo método
  updatePaciente(id: string, paciente: Partial<Paciente>): Promise<{ paciente: Paciente | null; message: string }>;
  deletePaciente(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePaciente(id: string): Promise<{ success: boolean; message: string }>;
  getHistorialMedico(pacienteId: string): Promise<HistorialMedico>;
}