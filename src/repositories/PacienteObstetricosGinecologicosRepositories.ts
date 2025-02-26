import { PacienteObstetricosGinecologicosModel } from "@models/PacienteObstetricosGinecologicos";
import { Query } from "types/RepositoryTypes";
import { IPacienteObstetricosGinecologicosRepository, PacienteObstetricosGinecologicos } from "types/PacienteObstetricosGinecologicosTypes";

export class PacienteObstetricosGinecologicosRepository implements IPacienteObstetricosGinecologicosRepository {
  async create(data: PacienteObstetricosGinecologicos): Promise<PacienteObstetricosGinecologicos> {
    const newPacienteOG = new PacienteObstetricosGinecologicosModel(data);
    return await newPacienteOG.save();
  }

  async find(query?: Query): Promise<PacienteObstetricosGinecologicos[]> {
    return await PacienteObstetricosGinecologicosModel.find(query || {}).populate("paciente tipoObstetricoGinecologico").exec();
  }

  async findActive(query?: Query): Promise<PacienteObstetricosGinecologicos[]> {
    return await PacienteObstetricosGinecologicosModel.find({ ...query, estado: "Activo" }).populate("paciente tipoObstetricoGinecologico").exec();
  }

  async findOne(query: Query): Promise<PacienteObstetricosGinecologicos | null> {
    return await PacienteObstetricosGinecologicosModel.findOne(query).populate("paciente tipoObstetricoGinecologico").exec();
  }

  async findById(id: string): Promise<PacienteObstetricosGinecologicos | null> {
    return await PacienteObstetricosGinecologicosModel.findById(id).populate("paciente tipoObstetricoGinecologico").exec();
  }

  async update(id: string, data: Partial<PacienteObstetricosGinecologicos>): Promise<PacienteObstetricosGinecologicos | null> {
    return await PacienteObstetricosGinecologicosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paciente tipoObstetricoGinecologico").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteObstetricosGinecologicosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}