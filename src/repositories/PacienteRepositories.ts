// src/repositories/PacienteRepositories.ts
import { PacienteModel } from "@models/Pacientes";
import { IPacienteRepository, Paciente } from "types/PacientesTypes";
import { Query } from "types/RepositoryTypes";

export class PacienteRepository implements IPacienteRepository {
  async create(data: Paciente): Promise<Paciente> {
    const newPaciente = new PacienteModel(data);
    return await newPaciente.save();
  }

  async find(query?: Query): Promise<Paciente[]> {
    return await PacienteModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<Paciente[]> {
    return await PacienteModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<Paciente | null> {
    return await PacienteModel.findOne(query).exec();
  }

  async findById(id: string): Promise<Paciente | null> {
    return await PacienteModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Paciente>): Promise<Paciente | null> {
    return await PacienteModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }

  async findByEstadoAtencion(estado: string): Promise<Paciente[]> {
    return await PacienteModel.find({ estadoAtencion: estado, estado: "Activo" }).exec();
  }
}