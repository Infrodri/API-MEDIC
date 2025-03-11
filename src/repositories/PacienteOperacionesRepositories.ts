// src/repositories/PacienteOperacionRepository.ts
import { PacienteOperacionModel } from "@models/PacienteOperaciones";
import { IPacienteOperacionRepository, PacienteOperacion } from "types/PacienteOperacionesTypes";
import { Query } from "types/RepositoryTypes";

export class PacienteOperacionRepository implements IPacienteOperacionRepository {
  async find(query?: Query): Promise<PacienteOperacion[]> {
    return PacienteOperacionModel.find(query || {})
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoOperacionQuirurgica", "nombre descripcion")
      .exec();
  }

  async findOne(query: Query): Promise<PacienteOperacion | null> {
    return PacienteOperacionModel.findOne(query)
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoOperacionQuirurgica", "nombre descripcion")
      .exec();
  }

  async findActive(query?: Query): Promise<PacienteOperacion[]> {
    return PacienteOperacionModel.find({ ...(query || {}), estado: "Activo" })
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoOperacionQuirurgica", "nombre descripcion")
      .exec();
  }

  async findByPaciente(pacienteId: string): Promise<PacienteOperacion[]> {
    return PacienteOperacionModel.find({ paciente: pacienteId, estado: "Activo" })
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoOperacionQuirurgica", "nombre descripcion")
      .exec();
  }

  async findById(id: string): Promise<PacienteOperacion | null> {
    return PacienteOperacionModel.findById(id)
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoOperacionQuirurgica", "nombre descripcion")
      .exec();
  }

  async create(data: Partial<PacienteOperacion>): Promise<PacienteOperacion> {
    const pacienteOperacion = new PacienteOperacionModel(data);
    return await pacienteOperacion.save();
  }

  async update(id: string, data: Partial<PacienteOperacion>): Promise<PacienteOperacion | null> {
    return PacienteOperacionModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente", "primerNombre primerApellido cedula")
      .populate("tipoOperacionQuirurgica", "nombre descripcion")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await PacienteOperacionModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}