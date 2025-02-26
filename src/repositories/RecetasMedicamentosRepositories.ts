import { RecetasMedicamentosModel } from "@models/RecetasMedicamentos";
import { Query } from "types/RepositoryTypes";
import { IRecetasMedicamentosRepository, RecetasMedicamentos } from "types/RecetasMedicamentosTypes";

export class RecetasMedicamentosRepository implements IRecetasMedicamentosRepository {
  async create(data: RecetasMedicamentos): Promise<RecetasMedicamentos> {
    const newRecetaMedicamento = new RecetasMedicamentosModel(data);
    return await newRecetaMedicamento.save();
  }

  async find(query?: Query): Promise<RecetasMedicamentos[]> {
    return await RecetasMedicamentosModel.find(query || {}).populate("receta medicamento").exec();
  }

  async findActive(query?: Query): Promise<RecetasMedicamentos[]> {
    return await RecetasMedicamentosModel.find({ ...query, estado: "Activo" }).populate("receta medicamento").exec();
  }

  async findOne(query: Query): Promise<RecetasMedicamentos | null> {
    return await RecetasMedicamentosModel.findOne(query).populate("receta medicamento").exec();
  }

  async findById(id: string): Promise<RecetasMedicamentos | null> {
    return await RecetasMedicamentosModel.findById(id).populate("receta medicamento").exec();
  }

  async update(id: string, data: Partial<RecetasMedicamentos>): Promise<RecetasMedicamentos | null> {
    return await RecetasMedicamentosModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("receta medicamento").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await RecetasMedicamentosModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}