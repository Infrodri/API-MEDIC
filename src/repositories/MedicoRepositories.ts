// src/repositories/MedicoRepositories.ts
import { MedicoModel } from "@models/Medicos";
import { Query } from "types/RepositoryTypes";
import { IMedicoRepository, Medico, PaginatedResult, PaginationOptions } from "types/MedicoTypes";

export class MedicoRepository implements IMedicoRepository {
  async create(data: Medico): Promise<Medico> {
    const newMedico = new MedicoModel(data);
    return await newMedico.save();
  }

  async find(query?: Query): Promise<Medico[]> {
    return await MedicoModel.find(query || {})
      .populate("especialidades")
      .populate("usuario")
      .exec();
  }

  async findActive(query?: Query): Promise<Medico[]> {
    return await MedicoModel.find({ ...query, estado: "Activo" })
      .populate("especialidades")
      .populate("usuario")
      .exec();
  }

  async findOne(query: Query): Promise<Medico | null> {
    return await MedicoModel.findOne(query)
      .populate("especialidades")
      .populate("usuario")
      .exec();
  }

  async findById(id: string): Promise<Medico | null> {
    return await MedicoModel.findById(id)
      .populate("especialidades")
      .populate("usuario")
      .exec();
  }

  async update(id: string, data: Partial<Medico>): Promise<Medico | null> {
    return await MedicoModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("especialidades")
      .populate("usuario")
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await MedicoModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }

  async countBySpecialty(): Promise<{ especialidad: string; count: number }[]> {
    return await MedicoModel.aggregate([
      { $match: { estado: "Activo" } },
      { $unwind: "$especialidades" },
      {
        $lookup: {
          from: "especialidades",
          localField: "especialidades",
          foreignField: "_id",
          as: "especialidadInfo",
        },
      },
      { $unwind: "$especialidadInfo" },
      { $group: { _id: "$especialidadInfo.nombre", count: { $sum: 1 } } },
      { $project: { especialidad: "$_id", count: 1, _id: 0 } },
    ]).exec();
  }

  async countActiveToday(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await MedicoModel.countDocuments({
      estado: "Activo",
      updatedAt: { $gte: startOfDay, $lte: endOfDay },
    }).exec();
  }

  async countTotal(): Promise<number> {
    return await MedicoModel.countDocuments({}).exec();
  }

  // Nuevos métodos sugeridos
  async findBySpecialty(especialidadId: string): Promise<Medico[]> {
    return await MedicoModel.find({ especialidades: especialidadId, estado: "Activo" })
      .populate("especialidades")
      .populate("usuario")
      .exec();
  }

  async findByUser(userId: string): Promise<Medico[]> {
    return await MedicoModel.find({ usuario: userId, estado: "Activo" })
      .populate("especialidades")
      .populate("usuario")
      .exec();
  }

  async findWithMultipleSpecialties(): Promise<Medico[]> {
    return await MedicoModel.find({ 
      estado: "Activo", 
      $expr: { $gt: [{ $size: "$especialidades" }, 1] } 
    })
      .populate("especialidades")
      .populate("usuario")
      .exec();
  }
  async findPaginated(query?: Query, options: PaginationOptions = {}): Promise<PaginatedResult<Medico>> {
    const { page = 1, limit = 10, sort } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MedicoModel.find({ ...query, estado: "Activo" })
        .populate("especialidades")
        .populate("usuario")
        .sort(sort || "primerNombre")
        .skip(skip)
        .limit(limit)
        .exec(),
      MedicoModel.countDocuments({ ...query, estado: "Activo" }).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

async updateActiveStatus(id: string, estaActivo: boolean): Promise<Medico | null> {
  return await MedicoModel.findByIdAndUpdate(
    id,
    { estaActivo },
    { new: true, runValidators: true }
  )
    .populate("especialidades")
    .populate("usuario")
    .exec();
}

}