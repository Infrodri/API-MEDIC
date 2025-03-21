// src/repositories/MedicamentosRepositories.ts
import { Query } from "types/RepositoryTypes";
import { IMedicamentosRepository, Medicamentos } from "types/MedicamentosTypes";
import { MedicamentosModel } from "@models/Medicamentos";
import { Medico, PaginatedResult, PaginationOptions } from "types/MedicoTypes";
import { MedicoModel } from "@models/Medicos";

export class MedicamentosRepository implements IMedicamentosRepository {
  async create(data: Medicamentos): Promise<Medicamentos> {
    const newMedicamento = new MedicamentosModel(data);
    return await newMedicamento.save();
  }

  async find(query?: Query): Promise<Medicamentos[]> {
    return await MedicamentosModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<Medicamentos[]> {
    return await MedicamentosModel.find(query || {}).exec(); // Sin filtro por estado
  }

  async findOne(query: Query): Promise<Medicamentos | null> {
    return await MedicamentosModel.findOne(query).exec();
  }

  async findById(id: string): Promise<Medicamentos | null> {
    return await MedicamentosModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Medicamentos>): Promise<Medicamentos | null> {
    return await MedicamentosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await MedicamentosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }


}
