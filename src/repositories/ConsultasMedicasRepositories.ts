// src/repositories/ConsultasMedicasRepositories.ts
import { ConsultasMedicasModel } from "@models/ConsultasMedicas";
import { Query } from "types/RepositoryTypes";
import { IConsultasMedicasRepository, ConsultasMedicas } from "types/ConsultasMedicasTypes";

export class ConsultasMedicasRepository implements IConsultasMedicasRepository {
  async create(data: ConsultasMedicas): Promise<ConsultasMedicas> {
    const newConsulta = new ConsultasMedicasModel(data);
    return await newConsulta.save();
  }

  async find(query?: Query): Promise<ConsultasMedicas[]> {
    return await ConsultasMedicasModel.find(query || {})
      .populate("paciente")
      .populate("medico")
      .populate("medicoDerivado")
      .populate("recetas")
      .populate("examenes")
      .exec();
  }

  async findActive(query?: Query): Promise<ConsultasMedicas[]> {
    return await ConsultasMedicasModel.find({ ...query, estado: "Activo" })
      .populate("paciente")
      .populate("medico")
      .populate("medicoDerivado")
      .populate("recetas")
      .populate("examenes")
      .exec();
  }

  async findOne(query: Query): Promise<ConsultasMedicas | null> {
    return await ConsultasMedicasModel.findOne(query)
      .populate("paciente")
      .populate("medico")
      .populate("medicoDerivado")
      .populate("recetas")
      .populate("examenes")
      .exec();
  }

  async findById(id: string): Promise<ConsultasMedicas | null> {
    return await ConsultasMedicasModel.findById(id)
      .populate("paciente")
      .populate("medico")
      .populate("medicoDerivado")
      .populate("recetas")
      .populate("examenes")
      .exec();
  }

  async update(id: string, data: Partial<ConsultasMedicas>): Promise<ConsultasMedicas | null> {
    return await ConsultasMedicasModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("paciente")
      .populate("medico")
      .populate("medicoDerivado")
      .populate("recetas")
      .populate("examenes")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ConsultasMedicasModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }

  async checkAvailability(medicoId: string, fecha: Date, duracion: number): Promise<boolean> {
    const start = new Date(fecha);
    const end = new Date(start.getTime() + duracion * 60000);
    const conflictingCitas = await ConsultasMedicasModel.find({
      medico: medicoId,
      estadoConsulta: { $in: ["Pendiente", "Concluida"] },
      fecha: { $lt: end },
      $expr: { $gt: [{ $add: ["$fecha", { $multiply: ["$duracion", 60000] }] }, start] },
    });
    return conflictingCitas.length === 0;
  }
}