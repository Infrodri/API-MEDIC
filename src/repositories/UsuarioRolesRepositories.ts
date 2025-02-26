import { UsuarioRolesModel } from "@models/UsuarioRoles";
import { Query } from "types/RepositoryTypes";
import { IUsuarioRolesRepository, UsuarioRoles } from "types/UsuarioRolesTypes";

export class UsuarioRolesRepository implements IUsuarioRolesRepository {
  async create(data: UsuarioRoles): Promise<UsuarioRoles> {
    const newUsuarioRol = new UsuarioRolesModel(data);
    return await newUsuarioRol.save();
  }

  async find(query?: Query): Promise<UsuarioRoles[]> {
    return await UsuarioRolesModel.find(query || {}).populate("usuario rol").exec();
  }

  async findActive(query?: Query): Promise<UsuarioRoles[]> {
    return await UsuarioRolesModel.find({ ...query, estado: "Activo" }).populate("usuario rol").exec();
  }

  async findOne(query: Query): Promise<UsuarioRoles | null> {
    return await UsuarioRolesModel.findOne(query).populate("usuario rol").exec();
  }

  async findById(id: string): Promise<UsuarioRoles | null> {
    return await UsuarioRolesModel.findById(id).populate("usuario rol").exec();
  }

  async update(id: string, data: Partial<UsuarioRoles>): Promise<UsuarioRoles | null> {
    return await UsuarioRolesModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("usuario rol").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await UsuarioRolesModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}