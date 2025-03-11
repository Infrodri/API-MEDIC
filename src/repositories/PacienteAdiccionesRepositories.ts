// src/repositories/PacienteAdiccionRepository.ts
import { PacienteAdiccionModel } from "@models/PacienteAdicciones";
import { IPacienteAdiccionRepository, PacienteAdiccion } from "types/PacienteAdiccionesTypes";
import { Query } from "types/RepositoryTypes";

export class PacienteAdiccionRepository implements IPacienteAdiccionRepository {
  async find(query?: Query): Promise<PacienteAdiccion[]> {
    return PacienteAdiccionModel.find(query || {})
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoAdiccion", "nombre descripcion")
      .exec();
  }

  async findOne(query: Query): Promise<PacienteAdiccion | null> {
    return PacienteAdiccionModel.findOne(query)
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoAdiccion", "nombre descripcion")
      .exec();
  }

  async findActive(query?: Query): Promise<PacienteAdiccion[]> {
    return PacienteAdiccionModel.find({ ...(query || {}), estado: "Activo" })
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoAdiccion", "nombre descripcion")
      .exec();
  }

  async findByPaciente(pacienteId: string): Promise<PacienteAdiccion[]> {
    return PacienteAdiccionModel.find({ paciente: pacienteId, estado: "Activo" })
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoAdiccion", "nombre descripcion")
      .exec();
  }

  async findById(id: string): Promise<PacienteAdiccion | null> {
    return PacienteAdiccionModel.findById(id)
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoAdiccion", "nombre descripcion")
      .exec();
  }

  async create(data: Partial<PacienteAdiccion>): Promise<PacienteAdiccion> {
    const pacienteAdiccion = new PacienteAdiccionModel(data);
    return await pacienteAdiccion.save();
  }

  async update(id: string, data: Partial<PacienteAdiccion>): Promise<PacienteAdiccion | null> {
    return PacienteAdiccionModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoAdiccion", "nombre descripcion")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await PacienteAdiccionModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}