// src/repositories/FichasMedicasRepositories.ts
import { FichasMedicasModel } from "@models/FichasMedicas";
import { Query } from "types/RepositoryTypes";
import { IFichasMedicasRepository, FichasMedicas } from "types/FichasMedicasTypes";

export class FichasMedicasRepository implements IFichasMedicasRepository {
  async create(data: FichasMedicas): Promise<FichasMedicas> {
    const newFicha = new FichasMedicasModel(data);
    return await newFicha.save();
  }

  async find(query?: Query): Promise<FichasMedicas[]> {
    return await FichasMedicasModel.find(query || {})
      .populate("paciente")
      .populate("medico")
      .populate("especialidad")
      .exec();
  }

  async findActive(query?: Query): Promise<FichasMedicas[]> {
    return await FichasMedicasModel.find({ ...query, estado: "Activo" })
      .populate("paciente")
      .populate("medico")
      .populate("especialidad")
      .exec();
  }

  async findOne(query: Query): Promise<FichasMedicas | null> {
    return await FichasMedicasModel.findOne(query)
      .populate("paciente")
      .populate("medico")
      .populate("especialidad")
      .exec();
  }

  async findById(id: string): Promise<FichasMedicas | null> {
    return await FichasMedicasModel.findById(id)
      .populate("paciente")
      .populate("medico")
      .populate("especialidad")
      .exec();
  }

  async findByPaciente(pacienteId: string): Promise<FichasMedicas[]> {
    return await FichasMedicasModel.find({ paciente: pacienteId, estado: "Activo" })
      .populate("paciente")
      .populate("medico")
      .populate("especialidad")
      .exec();
  }

  async update(id: string, data: Partial<FichasMedicas>): Promise<FichasMedicas | null> {
    return await FichasMedicasModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente")
      .populate("medico")
      .populate("especialidad")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await FichasMedicasModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}