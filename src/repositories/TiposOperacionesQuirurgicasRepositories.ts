import { TiposOperacionesQuirurgicasModel } from "@models/TiposOperacionesQuirurgicas";
import { Query } from "types/RepositoryTypes";
import { ITiposOperacionesQuirurgicasRepository, TiposOperacionesQuirurgicas } from "types/TiposOperacionesQuirurgicasTypes";

export class TiposOperacionesQuirurgicasRepository implements ITiposOperacionesQuirurgicasRepository {
  async create(data: TiposOperacionesQuirurgicas): Promise<TiposOperacionesQuirurgicas> {
    const newTipos = new TiposOperacionesQuirurgicasModel(data);
    return await newTipos.save();
  }

  async find(query?: Query): Promise<TiposOperacionesQuirurgicas[]> {
    return await TiposOperacionesQuirurgicasModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<TiposOperacionesQuirurgicas[]> {
    return await TiposOperacionesQuirurgicasModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<TiposOperacionesQuirurgicas | null> {
    return await TiposOperacionesQuirurgicasModel.findOne(query).exec();
  }

  async findById(id: string): Promise<TiposOperacionesQuirurgicas | null> {
    return await TiposOperacionesQuirurgicasModel.findById(id).exec();
  }

  async update(id: string, data: Partial<TiposOperacionesQuirurgicas>): Promise<TiposOperacionesQuirurgicas | null> {
    return await TiposOperacionesQuirurgicasModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await TiposOperacionesQuirurgicasModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}