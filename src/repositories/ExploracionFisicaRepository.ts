import { ExploracionFisicaModel } from "@models/ExploracionFisica";
import { Query } from "types/RepositoryTypes";
import { IExploracionFisicaRepository, ExploracionFisica } from "types/ExploracionFisicaTypes";

export class ExploracionFisicaRepository implements IExploracionFisicaRepository {
  async create(data: ExploracionFisica): Promise<ExploracionFisica> {
    const newExploracion = new ExploracionFisicaModel(data);
    return await newExploracion.save();
  }

  async find(query?: Query): Promise<ExploracionFisica[]> {
    return await ExploracionFisicaModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<ExploracionFisica[]> {
    return await ExploracionFisicaModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<ExploracionFisica | null> {
    return await ExploracionFisicaModel.findOne(query).exec();
  }

  async findById(id: string): Promise<ExploracionFisica | null> {
    return await ExploracionFisicaModel.findById(id).exec();
  }

  async update(id: string, data: Partial<ExploracionFisica>): Promise<ExploracionFisica | null> {
    return await ExploracionFisicaModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ExploracionFisicaModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}