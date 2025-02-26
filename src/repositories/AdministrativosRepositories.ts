import { AdministrativosModel } from "@models/Administrativos";
import { Query } from "types/RepositoryTypes";
import { IAdministrativosRepository, Administrativos } from "types/AdministrativosTypes";

export class AdministrativosRepository implements IAdministrativosRepository {
  async create(data: Administrativos): Promise<Administrativos> {
    const newAdministrativo = new AdministrativosModel(data);
    return await newAdministrativo.save();
  }

  async find(query?: Query): Promise<Administrativos[]> {
    return await AdministrativosModel.find(query || {}).populate("usuario").exec();
  }

  async findActive(query?: Query): Promise<Administrativos[]> {
    return await AdministrativosModel.find({ ...query, estado: "Activo" }).populate("usuario").exec();
  }

  async findOne(query: Query): Promise<Administrativos | null> {
    return await AdministrativosModel.findOne(query).populate("usuario").exec();
  }

  async findById(id: string): Promise<Administrativos | null> {
    return await AdministrativosModel.findById(id).populate("usuario").exec();
  }

  async update(id: string, data: Partial<Administrativos>): Promise<Administrativos | null> {
    return await AdministrativosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("usuario").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await AdministrativosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}