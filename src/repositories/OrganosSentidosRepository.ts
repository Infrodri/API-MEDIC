import { OrganosSentidosModel } from "@models/OrganosSentidos";
import { Query } from "types/RepositoryTypes";
import { IOrganosSentidosRepository, OrganosSentidos } from "types/OrganosSentidosTypes";

export class OrganosSentidosRepository implements IOrganosSentidosRepository {
  async create(data: OrganosSentidos): Promise<OrganosSentidos> {
    const newOrgano = new OrganosSentidosModel(data);
    return await newOrgano.save();
  }

  async find(query?: Query): Promise<OrganosSentidos[]> {
    return await OrganosSentidosModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<OrganosSentidos[]> {
    return await OrganosSentidosModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<OrganosSentidos | null> {
    return await OrganosSentidosModel.findOne(query).exec();
  }

  async findById(id: string): Promise<OrganosSentidos | null> {
    return await OrganosSentidosModel.findById(id).exec();
  }

  async update(id: string, data: Partial<OrganosSentidos>): Promise<OrganosSentidos | null> {
    return await OrganosSentidosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await OrganosSentidosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}