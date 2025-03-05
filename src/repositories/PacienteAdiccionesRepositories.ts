// src/repositories/PacienteAdiccionesRepositories.ts
import { PacienteAdiccionModel } from "@models/PacienteAdicciones";
import { Query } from "types/RepositoryTypes";
import { IPacienteAdiccionRepository, PacienteAdiccion } from "types/PacienteAdiccionesTypes";

export class PacienteAdiccionRepository implements IPacienteAdiccionRepository {
  async create(data: PacienteAdiccion): Promise<PacienteAdiccion> {
    const newPacienteAdiccion = new PacienteAdiccionModel(data);
    return await newPacienteAdiccion.save();
  }

  async find(query?: Query): Promise<PacienteAdiccion[]> {
    return await PacienteAdiccionModel.find(query || {})
      .populate("paciente")
      .populate("tipoAdiccion")
      .exec();
  }

  async findActive(query?: Query): Promise<PacienteAdiccion[]> {
    return await PacienteAdiccionModel.find({ ...query, estado: "Activo" })
      .populate("paciente")
      .populate("tipoAdiccion")
      .exec();
  }

  async findOne(query: Query): Promise<PacienteAdiccion | null> {
    return await PacienteAdiccionModel.findOne(query)
      .populate("paciente")
      .populate("tipoAdiccion")
      .exec();
  }

  async findById(id: string): Promise<PacienteAdiccion | null> {
    return await PacienteAdiccionModel.findById(id)
      .populate("paciente")
      .populate("tipoAdiccion")
      .exec();
  }

  async findByPaciente(pacienteId: string): Promise<PacienteAdiccion[]> {
    return await PacienteAdiccionModel.find({ paciente: pacienteId, estado: "Activo" })
      .populate("paciente")
      .populate("tipoAdiccion")
      .exec();
  }

  async update(id: string, data: Partial<PacienteAdiccion>): Promise<PacienteAdiccion | null> {
    return await PacienteAdiccionModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente")
      .populate("tipoAdiccion")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteAdiccionModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}