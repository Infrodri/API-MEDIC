// src/repositories/PacienteExamenRepositories.ts
import { PacienteExamenModel } from "@models/PacienteExamenes";
import { Query } from "types/RepositoryTypes";
import { IPacienteExamenRepository, PacienteExamen } from "types/PacienteExamenesTypes";

export class PacienteExamenRepository implements IPacienteExamenRepository {
  async create(data: PacienteExamen): Promise<PacienteExamen> {
    const newPacienteExamen = new PacienteExamenModel(data);
    return await newPacienteExamen.save();
  }

  async find(query?: Query): Promise<PacienteExamen[]> {
    return await PacienteExamenModel.find(query || {})
      .populate("paciente")
      .populate("examenMedico")
      .exec();
  }

  async findActive(query?: Query): Promise<PacienteExamen[]> {
    return await PacienteExamenModel.find({ ...query, estado: "Activo" })
      .populate("paciente")
      .populate("examenMedico")
      .exec();
  }

  async findOne(query: Query): Promise<PacienteExamen | null> {
    return await PacienteExamenModel.findOne(query)
      .populate("paciente")
      .populate("examenMedico")
      .exec();
  }

  async findById(id: string): Promise<PacienteExamen | null> {
    return await PacienteExamenModel.findById(id)
      .populate("paciente")
      .populate("examenMedico")
      .exec();
  }

  async findByPaciente(pacienteId: string): Promise<PacienteExamen[]> {
    return await PacienteExamenModel.find({ paciente: pacienteId, estado: "Activo" })
      .populate("paciente")
      .populate("examenMedico")
      .exec();
  }

  async update(id: string, data: Partial<PacienteExamen>): Promise<PacienteExamen | null> {
    return await PacienteExamenModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente")
      .populate("examenMedico")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteExamenModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}