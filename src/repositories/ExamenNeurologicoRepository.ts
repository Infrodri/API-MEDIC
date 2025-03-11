import { ExamenNeurologicoModel } from "@models/ExamenNeurologico";
import { Query } from "types/RepositoryTypes";
import { IExamenNeurologicoRepository, ExamenNeurologico } from "types/ExamenNeurologicoTypes";

export class ExamenNeurologicoRepository implements IExamenNeurologicoRepository {
  async create(data: ExamenNeurologico): Promise<ExamenNeurologico> {
    const newExamen = new ExamenNeurologicoModel(data);
    return await newExamen.save();
  }

  async find(query?: Query): Promise<ExamenNeurologico[]> {
    return await ExamenNeurologicoModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<ExamenNeurologico[]> {
    return await ExamenNeurologicoModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<ExamenNeurologico | null> {
    return await ExamenNeurologicoModel.findOne(query).exec();
  }

  async findById(id: string): Promise<ExamenNeurologico | null> {
    return await ExamenNeurologicoModel.findById(id).exec();
  }

  async update(id: string, data: Partial<ExamenNeurologico>): Promise<ExamenNeurologico | null> {
    return await ExamenNeurologicoModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ExamenNeurologicoModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}