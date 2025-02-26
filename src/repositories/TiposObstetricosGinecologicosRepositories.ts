import { TiposObstetricosGinecologicosModel } from "@models/TiposObstetricosGinecologicos";
import { Query } from "types/RepositoryTypes";
import { ITiposObstetricosGinecologicosRepository, TiposObstetricosGinecologicos } from "types/TiposObstetricosGinecologicosTypes";

export class TiposObstetricosGinecologicosRepository implements ITiposObstetricosGinecologicosRepository {
  async create(data: TiposObstetricosGinecologicos): Promise<TiposObstetricosGinecologicos> {
    const newTipos = new TiposObstetricosGinecologicosModel(data);
    return await newTipos.save();
  }

  async find(query?: Query): Promise<TiposObstetricosGinecologicos[]> {
    return await TiposObstetricosGinecologicosModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<TiposObstetricosGinecologicos[]> {
    return await TiposObstetricosGinecologicosModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<TiposObstetricosGinecologicos | null> {
    return await TiposObstetricosGinecologicosModel.findOne(query).exec();
  }

  async findById(id: string): Promise<TiposObstetricosGinecologicos | null> {
    return await TiposObstetricosGinecologicosModel.findById(id).exec();
  }

  async update(id: string, data: Partial<TiposObstetricosGinecologicos>): Promise<TiposObstetricosGinecologicos | null> {
    return await TiposObstetricosGinecologicosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await TiposObstetricosGinecologicosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}