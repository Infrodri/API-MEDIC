// src/repositories/PacienteOperacionesRepositories.ts

import { Query } from "types/RepositoryTypes";
import { IPacienteOperacionRepository, PacienteOperacion } from "types/PacienteOperacionesTypes";
import { PacienteOperacionesModel } from "@models/PacienteOperaciones";

export class PacienteOperacionRepository implements IPacienteOperacionRepository {
  async create(data: PacienteOperacion): Promise<PacienteOperacion> {
    const newPacienteOperacion = new PacienteOperacionesModel(data);
    return await newPacienteOperacion.save();
  } 

  async find(query?: Query): Promise<PacienteOperacion[]> {
    return await PacienteOperacionesModel.find(query || {})
      .populate("paciente")
      .populate("tipoOperacionQuirurgica")
      .exec();
  }

  async findActive(query?: Query): Promise<PacienteOperacion[]> {
    return await PacienteOperacionesModel.find({ ...query, estado: "Activo" })
      .populate("paciente")
      .populate("tipoOperacionQuirurgica")
      .exec();
  }

  async findOne(query: Query): Promise<PacienteOperacion | null> {
    return await PacienteOperacionesModel.findOne(query)
      .populate("paciente")
      .populate("tipoOperacionQuirurgica")
      .exec();
  }

  async findById(id: string): Promise<PacienteOperacion | null> {
    return await PacienteOperacionesModel.findById(id)
      .populate("paciente")
      .populate("tipoOperacionQuirurgica")
      .exec();
  }

  async findByPaciente(pacienteId: string): Promise<PacienteOperacion[]> {
    return await PacienteOperacionesModel.find({ paciente: pacienteId, estado: "Activo" })
      .populate("paciente")
      .populate("tipoOperacionQuirurgica")
      .exec();
  }

  async update(id: string, data: Partial<PacienteOperacion>): Promise<PacienteOperacion | null> {
    return await PacienteOperacionesModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente")
      .populate("tipoOperacionQuirurgica")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PacienteOperacionesModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}