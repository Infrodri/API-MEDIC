import { PacienteOperacionesModel } from "@models/PacienteOperaciones";
import { Query } from "types/RepositoryTypes";
import { IPacienteOperacionesRepository, PacienteOperaciones } from "types/PacienteOperacionesTypes";

export class PacienteOperacionesRepository implements IPacienteOperacionesRepository {
  async create(data: PacienteOperaciones): Promise<PacienteOperaciones> {
    const newPacienteOp = new PacienteOperacionesModel(data);
    return await newPacienteOp.save();
  }

  async find(query?: Query): Promise<PacienteOperaciones[]> {
    return await PacienteOperacionesModel.find(query || {}).populate("paciente tipoOperacion").exec();
  }

  async findActive(query?: Query): Promise<PacienteOperaciones[]> {
    return await PacienteOperacionesModel.find({ ...query, estado: "Activo" }).populate("paciente tipoOperacion").exec();
  }

  async findOne(query: Query): Promise<PacienteOperaciones | null> {
    return await PacienteOperacionesModel.findOne(query).populate("paciente tipoOperacion").exec();
  }

  async findById(id: string): Promise<PacienteOperaciones | null> {
    return await PacienteOperacionesModel.findById(id).populate("paciente tipoOperacion").exec();
  }

  async update(id: string, data: Partial<PacienteOperaciones>): Promise<PacienteOperaciones | null> {
    return await PacienteOperacionesModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paciente tipoOperacion").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteOperacionesModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}