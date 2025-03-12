// src/repositories/HistorialMedicoRepository.ts
import { Model } from "mongoose";
import { FormattedHistorialMedico, IHistorialMedico, IHistorialMedicoRepository, Paciente } from "types/HistorialMedicoTypes";

export class HistorialMedicoRepository implements IHistorialMedicoRepository {
  private model: Model<IHistorialMedico>;

  constructor(model: Model<IHistorialMedico> = require("@models/HistorialMedico").default) {
    this.model = model;
  }
  findHistorialMedicoById(id: string): Promise<IHistorialMedico | null> {
    throw new Error("Method not implemented.");
  }
  findHistorialMedicoByPaciente(pacienteId: string): Promise<IHistorialMedico | null> {
    throw new Error("Method not implemented.");
  }
  updateHistorialMedico(id: string, data: Partial<IHistorialMedico>): Promise<IHistorialMedico | null> {
    throw new Error("Method not implemented.");
  }
  deleteHistorialMedico(id: string): Promise<IHistorialMedico | null> {
    throw new Error("Method not implemented.");
  }
  findByPaciente(pacienteId: string): Promise<IHistorialMedico[]> {
    throw new Error("Method not implemented.");
  }

  async createHistorialMedico(data: Partial<IHistorialMedico>): Promise<IHistorialMedico> {
    const historial = new this.model(data);
    return historial.save();
  }

  async create(data: Partial<IHistorialMedico>, userId: string): Promise<IHistorialMedico> {
    const historial = new this.model({ ...data, createdBy: userId });
    return historial.save();
  }

  // ... otros métodos ...

  async getFormattedHistorialMedico(id: string): Promise<FormattedHistorialMedico | null> {
    const historial = await this.model
      .findById(id)
      .populate<{ paciente: Paciente }>("paciente", "primerNombre primerApellido")
      .lean();

    if (!historial) return null;

    return {
      id: historial._id.toString(),
      paciente: historial.paciente
        ? `${historial.paciente.primerNombre} ${historial.paciente.primerApellido}`.trim()
        : undefined,
      alergias: historial.alergias ?? undefined,
      enfermedades: historial.enfermedades ?? undefined,
      cirugiasPrevias: historial.cirugiasPrevias ?? undefined,
      antecedentesFamiliares: historial.antecedentesFamiliares ?? undefined,
      createdAt: historial.createdAt,
      updatedAt: historial.updatedAt,
    };
  }
}