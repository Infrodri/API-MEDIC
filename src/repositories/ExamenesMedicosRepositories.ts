// src/repositories/ExamenesMedicosRepositories.ts
import { ExamenesMedicosModel } from "@models/ExamenesMedicos";
import { Query } from "types/RepositoryTypes";
import { IExamenesMedicosRepository, ExamenesMedicos } from "types/ExamenesMedicosTypes";

export class ExamenesMedicosRepository implements IExamenesMedicosRepository {
  async create(data: ExamenesMedicos): Promise<ExamenesMedicos> {
    const newExamen = new ExamenesMedicosModel(data);
    return await newExamen.save();
  }

  async find(query?: Query): Promise<ExamenesMedicos[]> {
    return await ExamenesMedicosModel.find(query || {}).exec();
  }

  async findActive(query?: Query): Promise<ExamenesMedicos[]> {
    return await ExamenesMedicosModel.find({ ...query, estado: "Activo" }).exec();
  }

  async findOne(query: Query): Promise<ExamenesMedicos | null> {
    return await ExamenesMedicosModel.findOne(query).exec();
  }

  async findById(id: string): Promise<ExamenesMedicos | null> {
    return await ExamenesMedicosModel.findById(id).exec();
  }

  async update(id: string, data: Partial<ExamenesMedicos>): Promise<ExamenesMedicos | null> {
    return await ExamenesMedicosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ExamenesMedicosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}