import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface Paciente extends Document {
  nombre: string; // Name
  apellido: string; // Last name
  fechaNacimiento: Date; // Birth date
  direccion: string; // Address
  telefono: string; // Phone
  celular: string; // Cell phone
  genero: string; // Gender
  cedula: string; // ID number
  estado: "Activo" | "Inactivo"; // Status for logical deletion

}

export interface IPacienteRepository extends Repository<Paciente> {
  findOne(query: Query): Promise<Paciente | null>;
  findActive(query?: Query): Promise<Paciente[]>; // Method to find only active patients
}

export interface IPacienteService {
  createPaciente(paciente: Paciente): Promise<{ paciente: Paciente; message: string }>;
  findPacientes(query?: Query): Promise<Paciente[]>;
  findPacienteById(id: string): Promise<Paciente | null>;
  findPacienteByCedula(cedula: string): Promise<Paciente | null>;
  updatePaciente(id: string, paciente: Partial<Paciente>): Promise<{ paciente: Paciente | null; message: string }>;
  deletePaciente(id: string): Promise<{ success: boolean; message: string }>;
  softDeletePaciente(id: string): Promise<{ success: boolean; message: string }>; // Soft delete (change status)
}