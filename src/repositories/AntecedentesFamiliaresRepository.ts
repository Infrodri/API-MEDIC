import { AntecedentesFamiliaresModel } from "@models/AntecedentesFamiliares";
import { Query } from "types/RepositoryTypes";
import { IAntecedentesFamiliaresRepository, AntecedentesFamiliares } from "types/AntecedentesFamiliaresTypes";

export class AntecedentesFamiliaresRepository implements IAntecedentesFamiliaresRepository {
  async create(data: AntecedentesFamiliares): Promise<AntecedentesFamiliares> {
    const newAntecedente = new AntecedentesFamiliaresModel(data);
    return await newAntecedente.save();
  }

  async find(query?: Query): Promise<AntecedentesFamiliares[]> {
    return await AntecedentesFamiliaresModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<AntecedentesFamiliares[]> {
    return await AntecedentesFamiliaresModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<AntecedentesFamiliares | null> {
    return await AntecedentesFamiliaresModel.findOne(query).exec();
  }

  async findById(id: string): Promise<AntecedentesFamiliares | null> {
    return await AntecedentesFamiliaresModel.findById(id).exec();
  }

  async update(id: string, data: Partial<AntecedentesFamiliares>): Promise<AntecedentesFamiliares | null> {
    return await AntecedentesFamiliaresModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await AntecedentesFamiliaresModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}