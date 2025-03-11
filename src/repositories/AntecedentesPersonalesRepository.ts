import { AntecedentesPersonalesModel } from "@models/AntecedentesPersonales";
import { Query } from "types/RepositoryTypes";
import { IAntecedentesPersonalesRepository, AntecedentesPersonales } from "types/AntecedentesPersonalesTypes";

export class AntecedentesPersonalesRepository implements IAntecedentesPersonalesRepository {
  async create(data: AntecedentesPersonales): Promise<AntecedentesPersonales> {
    const newAntecedente = new AntecedentesPersonalesModel(data);
    return await newAntecedente.save();
  }

  async find(query?: Query): Promise<AntecedentesPersonales[]> {
    return await AntecedentesPersonalesModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<AntecedentesPersonales[]> {
    return await AntecedentesPersonalesModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<AntecedentesPersonales | null> {
    return await AntecedentesPersonalesModel.findOne(query).exec();
  }

  async findById(id: string): Promise<AntecedentesPersonales | null> {
    return await AntecedentesPersonalesModel.findById(id).exec();
  }

  async update(id: string, data: Partial<AntecedentesPersonales>): Promise<AntecedentesPersonales | null> {
    return await AntecedentesPersonalesModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await AntecedentesPersonalesModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}