import { RecetasMedicasModel } from "@models/RecetasMedicas";
import { Query } from "types/RepositoryTypes";
import { IRecetasMedicasRepository, RecetasMedicas } from "types/RecetasMedicasTypes";

export class RecetasMedicasRepository implements IRecetasMedicasRepository {
  async create(data: RecetasMedicas): Promise<RecetasMedicas> {
    const newReceta = new RecetasMedicasModel(data);
    return await newReceta.save();
  }

  async find(query?: Query): Promise<RecetasMedicas[]> {
    return await RecetasMedicasModel.find(query || {}).populate("consulta medicamentos").exec();
  }

  async findActive(query?: Query): Promise<RecetasMedicas[]> {
    return await RecetasMedicasModel.find({ ...query, estado: "Activo" }).populate("consulta medicamentos").exec();
  }

  async findOne(query: Query): Promise<RecetasMedicas | null> {
    return await RecetasMedicasModel.findOne(query).populate("consulta medicamentos").exec();
  }

  async findById(id: string): Promise<RecetasMedicas | null> {
    return await RecetasMedicasModel.findById(id).populate("consulta medicamentos").exec();
  }

  async update(id: string, data: Partial<RecetasMedicas>): Promise<RecetasMedicas | null> {
    return await RecetasMedicasModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("consulta medicamentos").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await RecetasMedicasModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}