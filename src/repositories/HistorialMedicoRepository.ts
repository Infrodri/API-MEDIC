// src/repositories/HistorialMedicoRepository.ts
import { HistorialMedico } from "../types/HistorialMedicoTypes";
import { HistorialMedicoModel } from "../models/HistorialMedico";

export interface IHistorialMedicoRepository {
  findByPaciente(pacienteId: string): Promise<HistorialMedico[]>;
  create(entry: Omit<HistorialMedico, "_id" | "createdAt" | "updatedAt">): Promise<HistorialMedico>;
}

export class HistorialMedicoRepository implements IHistorialMedicoRepository {
  async findByPaciente(pacienteId: string): Promise<HistorialMedico[]> {
    return HistorialMedicoModel.find({ paciente: pacienteId })
      .populate("medico", "primerNombre primerApellido")
      .populate("paciente", "primerNombre primerApellido")
      .exec();
  }

  async create(entry: Omit<HistorialMedico, "_id" | "createdAt" | "updatedAt">): Promise<HistorialMedico> {
    const newEntry = new HistorialMedicoModel(entry);
    return newEntry.save();
  }
}