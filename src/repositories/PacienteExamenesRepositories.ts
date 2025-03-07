import { PacienteExamenesModel } from "@models/PacienteExamenes";
import { Query } from "types/RepositoryTypes";
import { IPacienteExamenesRepository, PacienteExamenes } from "types/PacienteExamenesTypes";

export class PacienteExamenesRepository implements IPacienteExamenesRepository {
  async create(data: PacienteExamenes): Promise<PacienteExamenes> {
    const newPacienteExamen = new PacienteExamenesModel(data);
    return await newPacienteExamen.save();
  }

  async find(query?: Query): Promise<PacienteExamenes[]> {
    return await PacienteExamenesModel.find(query || {}).populate("paciente examen").exec();
  }

  async findActive(query?: Query): Promise<PacienteExamenes[]> {
    return await PacienteExamenesModel.find({ ...query, estado: "Activo" }).populate("paciente examen").exec();
  }

  async findOne(query: Query): Promise<PacienteExamenes | null> {
    return await PacienteExamenesModel.findOne(query).populate("paciente examen").exec();
  }

  async findById(id: string): Promise<PacienteExamenes | null> {
    return await PacienteExamenesModel.findById(id).populate("paciente examen").exec();
  }

  async update(id: string, data: Partial<PacienteExamenes>): Promise<PacienteExamenes | null> {
    return await PacienteExamenesModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paciente examen").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteExamenesModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}