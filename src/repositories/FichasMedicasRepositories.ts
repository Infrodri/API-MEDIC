// src/repositories/FichasMedicasRepositories.ts
import { FichasMedicasModel } from "@models/FichasMedicas";
import { IFichasMedicasRepository, FichasMedicas } from "types/FichasMedicasTypes";

export class FichasMedicasRepository implements IFichasMedicasRepository {
  async findByPaciente(pacienteId: string): Promise<FichasMedicas | null> {
    return FichasMedicasModel.findOne({ paciente: pacienteId, estado: "Activo" })
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .populate("antecedentesPersonales")
      .populate("antecedentesFamiliares")
      .populate({ path: "operacionesQuirurgicas", populate: { path: "tipoOperacionQuirurgica" } })
      .populate({ path: "ginecologiaObstetrica", populate: { path: "tipoObstetricoGinecologico" } })
      .populate({ path: "adicciones", populate: { path: "tipoAdiccion" } })
      .populate("exploracionFisica")
      .populate("examenNeurologico")
      .populate("organosSentidos")
      .exec();
  }

  async find(query?: any): Promise<FichasMedicas[]> {
    return FichasMedicasModel.find(query || {})
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .populate("antecedentesPersonales")
      .populate("antecedentesFamiliares")
      .populate({ path: "operacionesQuirurgicas", populate: { path: "tipoOperacionQuirurgica" } })
      .populate({ path: "ginecologiaObstetrica", populate: { path: "tipoObstetricoGinecologico" } })
      .populate({ path: "adicciones", populate: { path: "tipoAdiccion" } })
      .populate("exploracionFisica")
      .populate("examenNeurologico")
      .populate("organosSentidos")
      .exec();
  }

  // Nuevo método para listar con paginación
  async findWithPagination(query: any, skip: number, limit: number): Promise<FichasMedicas[]> {
    return FichasMedicasModel.find(query || {})
      .skip(skip)
      .limit(limit)
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .populate("antecedentesPersonales")
      .populate("antecedentesFamiliares")
      .populate({ path: "operacionesQuirurgicas", populate: { path: "tipoOperacionQuirurgica" } })
      .populate({ path: "ginecologiaObstetrica", populate: { path: "tipoObstetricoGinecologico" } })
      .populate({ path: "adicciones", populate: { path: "tipoAdiccion" } })
      .populate("exploracionFisica")
      .populate("examenNeurologico")
      .populate("organosSentidos")
      .exec();
  }

  async findOne(query: any): Promise<FichasMedicas | null> {
    return FichasMedicasModel.findOne(query)
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .populate("antecedentesPersonales")
      .populate("antecedentesFamiliares")
      .populate({ path: "operacionesQuirurgicas", populate: { path: "tipoOperacionQuirurgica" } })
      .populate({ path: "ginecologiaObstetrica", populate: { path: "tipoObstetricoGinecologico" } })
      .populate({ path: "adicciones", populate: { path: "tipoAdiccion" } })
      .populate("exploracionFisica")
      .populate("examenNeurologico")
      .populate("organosSentidos")
      .exec();
  }

  async findById(id: string): Promise<FichasMedicas | null> {
    return FichasMedicasModel.findById(id)
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .populate("antecedentesPersonales")
      .populate("antecedentesFamiliares")
      .populate({ path: "operacionesQuirurgicas", populate: { path: "tipoOperacionQuirurgica" } })
      .populate({ path: "ginecologiaObstetrica", populate: { path: "tipoObstetricoGinecologico" } })
      .populate({ path: "adicciones", populate: { path: "tipoAdiccion" } })
      .populate("exploracionFisica")
      .populate("examenNeurologico")
      .populate("organosSentidos")
      .exec();
  }

  async create(data: Partial<FichasMedicas>): Promise<FichasMedicas> {
    const ficha = new FichasMedicasModel(data);
    return await ficha.save();
  }

  async update(id: string, data: Partial<FichasMedicas>): Promise<FichasMedicas | null> {
    return FichasMedicasModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .populate("antecedentesPersonales")
      .populate("antecedentesFamiliares")
      .populate({ path: "operacionesQuirurgicas", populate: { path: "tipoOperacionQuirurgica" } })
      .populate({ path: "ginecologiaObstetrica", populate: { path: "tipoObstetricoGinecologico" } })
      .populate({ path: "adicciones", populate: { path: "tipoAdiccion" } })
      .populate("exploracionFisica")
      .populate("examenNeurologico")
      .populate("organosSentidos")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await FichasMedicasModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}