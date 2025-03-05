// src/repositories/PacienteObstetricosGinecologicosRepositories.ts
import { PacienteObstetricoGinecologicoModel } from "@models/PacienteObstetricosGinecologicos";
import { Query } from "types/RepositoryTypes";
import { IPacienteObstetricoGinecologicoRepository, PacienteObstetricoGinecologico } from "types/PacienteObstetricosGinecologicosTypes";

export class PacienteObstetricoGinecologicoRepository implements IPacienteObstetricoGinecologicoRepository {
  async create(data: PacienteObstetricoGinecologico): Promise<PacienteObstetricoGinecologico> {
    const newPacienteObstetricoGinecologico = new PacienteObstetricoGinecologicoModel(data);
    return await newPacienteObstetricoGinecologico.save();
  }

  async find(query?: Query): Promise<PacienteObstetricoGinecologico[]> {
    return await PacienteObstetricoGinecologicoModel.find(query || {})
      .populate("paciente")
      .populate("tipoObstetricoGinecologico")
      .exec();
  }

  async findActive(query?: Query): Promise<PacienteObstetricoGinecologico[]> {
    return await PacienteObstetricoGinecologicoModel.find({ ...query, estado: "Activo" })
      .populate("paciente")
      .populate("tipoObstetricoGinecologico")
      .exec();
  }

  async findOne(query: Query): Promise<PacienteObstetricoGinecologico | null> {
    return await PacienteObstetricoGinecologicoModel.findOne(query)
      .populate("paciente")
      .populate("tipoObstetricoGinecologico")
      .exec();
  }

  async findById(id: string): Promise<PacienteObstetricoGinecologico | null> {
    return await PacienteObstetricoGinecologicoModel.findById(id)
      .populate("paciente")
      .populate("tipoObstetricoGinecologico")
      .exec();
  }

  async findByPaciente(pacienteId: string): Promise<PacienteObstetricoGinecologico[]> {
    return await PacienteObstetricoGinecologicoModel.find({ paciente: pacienteId, estado: "Activo" })
      .populate("paciente")
      .populate("tipoObstetricoGinecologico")
      .exec();
  }

  async update(id: string, data: Partial<PacienteObstetricoGinecologico>): Promise<PacienteObstetricoGinecologico | null> {
    return await PacienteObstetricoGinecologicoModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente")
      .populate("tipoObstetricoGinecologico")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteObstetricoGinecologicoModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}