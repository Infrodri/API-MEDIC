import { PermisosModel } from "@models/Permisos";
import { Query } from "types/RepositoryTypes";
import { IPermisosRepository, Permisos } from "types/PermisosTypes";

export class PermisosRepository implements IPermisosRepository {
  async create(data: Permisos): Promise<Permisos> {
    const newPermiso = new PermisosModel(data);
    return await newPermiso.save();
  }

  async find(query?: Query): Promise<Permisos[]> {
    return await PermisosModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<Permisos[]> {
    return await PermisosModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<Permisos | null> {
    return await PermisosModel.findOne(query).exec();
  }

  async findById(id: string): Promise<Permisos | null> {
    return await PermisosModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Permisos>): Promise<Permisos | null> {
    return await PermisosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PermisosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}