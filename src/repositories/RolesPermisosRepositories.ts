import { RolesPermisosModel } from "@models/RolesPermisos";
import { Query } from "types/RepositoryTypes";
import { IRolesPermisosRepository, RolesPermisos } from "types/RolesPermisosTypes";

export class RolesPermisosRepository implements IRolesPermisosRepository {
  async create(data: RolesPermisos): Promise<RolesPermisos> {
    const newRolPermiso = new RolesPermisosModel(data);
    return await newRolPermiso.save();
  }

  async find(query?: Query): Promise<RolesPermisos[]> {
    return await RolesPermisosModel.find(query || {}).populate("rol permiso").exec();
  }

  async findActive(query?: Query): Promise<RolesPermisos[]> {
    return await RolesPermisosModel.find({ ...query, estado: "Activo" }).populate("rol permiso").exec();
  }

  async findOne(query: Query): Promise<RolesPermisos | null> {
    return await RolesPermisosModel.findOne(query).populate("rol permiso").exec();
  }

  async findById(id: string): Promise<RolesPermisos | null> {
    return await RolesPermisosModel.findById(id).populate("rol permiso").exec();
  }

  async update(id: string, data: Partial<RolesPermisos>): Promise<RolesPermisos | null> {
    return await RolesPermisosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("rol permiso").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await RolesPermisosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}