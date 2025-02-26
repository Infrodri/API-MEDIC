import { FichasMedicasModel } from "@models/FichasMedicas";
import { Query } from "types/RepositoryTypes";
import { IFichasMedicasRepository, FichasMedicas } from "types/FichasMedicasTypes";

export class FichasMedicasRepository implements IFichasMedicasRepository {
  async create(data: FichasMedicas): Promise<FichasMedicas> {
    const newFicha = new FichasMedicasModel(data);
    return await newFicha.save();
  }

  async find(query?: Query): Promise<FichasMedicas[]> {
    return await FichasMedicasModel.find(query || {}).populate("paciente medico especialidad").exec();
  }

  async findActive(query?: Query): Promise<FichasMedicas[]> {
    return await FichasMedicasModel.find({ ...query, estado: "Activo" }).populate("paciente medico especialidad").exec();
  }

  async findOne(query: Query): Promise<FichasMedicas | null> {
    return await FichasMedicasModel.findOne(query).populate("paciente medico especialidad").exec();
  }

  async findById(id: string): Promise<FichasMedicas | null> {
    return await FichasMedicasModel.findById(id).populate("paciente medico especialidad").exec();
  }

  async update(id: string, data: Partial<FichasMedicas>): Promise<FichasMedicas | null> {
    return await FichasMedicasModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paciente medico especialidad").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await FichasMedicasModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}