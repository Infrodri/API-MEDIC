import { EspecialidadesModel } from "@models/Especialidades";
import { Query } from "types/RepositoryTypes";
import { IEspecialidadesRepository, Especialidades } from "types/EspecialidadesTypes";

export class EspecialidadesRepository implements IEspecialidadesRepository {
  async create(data: Especialidades): Promise<Especialidades> {
    const newEspecialidad = new EspecialidadesModel(data);
    return await newEspecialidad.save();
  }

  async find(query?: Query): Promise<Especialidades[]> {
    return await EspecialidadesModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<Especialidades[]> {
    return await EspecialidadesModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<Especialidades | null> {
    return await EspecialidadesModel.findOne(query).exec();
  }

  async findById(id: string): Promise<Especialidades | null> {
    return await EspecialidadesModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Especialidades>): Promise<Especialidades | null> {
    return await EspecialidadesModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await EspecialidadesModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}