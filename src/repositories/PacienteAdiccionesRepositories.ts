import { PacienteAdiccionesModel } from "@models/PacienteAdicciones";
import { Query } from "types/RepositoryTypes";
import { IPacienteAdiccionesRepository, PacienteAdicciones } from "types/PacienteAdiccionesTypes";

export class PacienteAdiccionesRepository implements IPacienteAdiccionesRepository {
  async create(data: PacienteAdicciones): Promise<PacienteAdicciones> {
    const newPacienteAdiccion = new PacienteAdiccionesModel(data);
    return await newPacienteAdiccion.save();
  }

  async find(query?: Query): Promise<PacienteAdicciones[]> {
    return await PacienteAdiccionesModel.find(query || {}).populate("paciente tipoAdiccion").exec();
  }

  async findActive(query?: Query): Promise<PacienteAdicciones[]> {
    return await PacienteAdiccionesModel.find({ ...query, estado: "Activo" }).populate("paciente tipoAdiccion").exec();
  }

  async findOne(query: Query): Promise<PacienteAdicciones | null> {
    return await PacienteAdiccionesModel.findOne(query).populate("paciente tipoAdiccion").exec();
  }

  async findById(id: string): Promise<PacienteAdicciones | null> {
    return await PacienteAdiccionesModel.findById(id).populate("paciente tipoAdiccion").exec();
  }

  async update(id: string, data: Partial<PacienteAdicciones>): Promise<PacienteAdicciones | null> {
    return await PacienteAdiccionesModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paciente tipoAdiccion").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteAdiccionesModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}