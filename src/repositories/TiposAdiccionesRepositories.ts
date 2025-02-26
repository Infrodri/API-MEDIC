import { TiposAdiccionesModel } from "@models/TiposAdicciones";
import { Query } from "types/RepositoryTypes";
import { ITiposAdiccionRepository, TiposAdiccion } from "types/TiposAdiccionesTypes";

export class TiposAdiccionesRepository implements ITiposAdiccionRepository {
  async create(data: TiposAdiccion): Promise<TiposAdiccion> {
    const newTiposAdiccion = new TiposAdiccionesModel(data);
    return await newTiposAdiccion.save();
  }

  async find(query?: Query): Promise<TiposAdiccion[]> {
    return await TiposAdiccionesModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<TiposAdiccion[]> {
    return await TiposAdiccionesModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<TiposAdiccion | null> {
    return await TiposAdiccionesModel.findOne(query).exec();
  }

  async findById(id: string): Promise<TiposAdiccion | null> {
    return await TiposAdiccionesModel.findById(id).exec();
  }

  async update(id: string, data: Partial<TiposAdiccion>): Promise<TiposAdiccion | null> {
    return await TiposAdiccionesModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await TiposAdiccionesModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}