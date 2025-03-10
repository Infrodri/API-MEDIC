// src/repositories/HistorialMedicoRepository.ts
import { HistorialMedico } from "../types/HistorialMedicoTypes";
import { HistorialMedicoModel } from "../models/HistorialMedico";
import { AntecedentesPersonalesModel } from "../models/AntecedentesPersonales";
import { ExploracionFisicaModel } from "../models/ExploracionFisica";
import { ExamenNeurologicoModel } from "../models/ExamenNeurologico";
import { OrganosSentidosModel } from "../models/OrganosSentidos";

export interface IHistorialMedicoRepository {
  findByPaciente(pacienteId: string): Promise<HistorialMedico[]>;
  create(entry: Omit<HistorialMedico, "_id" | "createdAt" | "updatedAt">, userId: string): Promise<HistorialMedico>;
}

export class HistorialMedicoRepository implements IHistorialMedicoRepository {
  async findByPaciente(pacienteId: string): Promise<HistorialMedico[]> {
    return HistorialMedicoModel.find({ paciente: pacienteId })
      .populate("antecedentesPersonales")
      .populate("operacionesQuirurgicas")
      .populate("ginecologiaObstetrica")
      .populate("adicciones")
      .populate("exploracionFisica")
      .populate("examenNeurologico")
      .populate("organosSentidos")
      .populate("medico", "primerNombre primerApellido")
      .populate("paciente", "primerNombre primerApellido")
      .exec();
  }

  async create(entry: Omit<HistorialMedico, "_id" | "createdAt" | "updatedAt">, userId: string): Promise<HistorialMedico> {
    // Crear subdocumentos si existen
    let antecedentesPersonalesId: string | undefined;
    if (entry.antecedentesPersonales) {
      const antecedentes = await AntecedentesPersonalesModel.create({
        paciente: entry.paciente,
        ...entry.antecedentesPersonales,
      });
      antecedentesPersonalesId = antecedentes._id;
    }

    let exploracionFisicaId: string | undefined;
    if (entry.exploracionFisica) {
      const exploracion = await ExploracionFisicaModel.create({
        paciente: entry.paciente,
        ...entry.exploracionFisica,
      });
      exploracionFisicaId = exploracion._id;
    }

    let examenNeurologicoId: string | undefined;
    if (entry.examenNeurologico) {
      const examen = await ExamenNeurologicoModel.create({
        paciente: entry.paciente,
        ...entry.examenNeurologico,
      });
      examenNeurologicoId = examen._id;
    }

    let organosSentidosId: string | undefined;
    if (entry.organosSentidos) {
      const organos = await OrganosSentidosModel.create({
        paciente: entry.paciente,
        ...entry.organosSentidos,
      });
      organosSentidosId = organos._id;
    }

    const newEntry = new HistorialMedicoModel({
      ...entry,
      antecedentesPersonales: antecedentesPersonalesId,
      exploracionFisica: exploracionFisicaId,
      examenNeurologico: examenNeurologicoId,
      organosSentidos: organosSentidosId,
      medico: userId,
    });
    return newEntry.save();
  }
}