import { Query } from "types/RepositoryTypes";
import { IRecetasMedicamentosRepository, IRecetasMedicamentosService, RecetasMedicamentos } from "types/RecetasMedicamentosTypes";

export class RecetasMedicamentosService implements IRecetasMedicamentosService {
  private recetasMedicamentosRepository: IRecetasMedicamentosRepository;

  constructor(recetasMedicamentosRepository: IRecetasMedicamentosRepository) {
    this.recetasMedicamentosRepository = recetasMedicamentosRepository;
  }

  async createRecetasMedicamentos(recetaMedicamentoData: Omit<RecetasMedicamentos, keyof Document>): Promise<{ recetaMedicamento: RecetasMedicamentos; message: string }> {
    const newRecetaMedicamento = await this.recetasMedicamentosRepository.create({
      ...recetaMedicamentoData,
      estado: "Activo",
    });
    return { recetaMedicamento: newRecetaMedicamento, message: "Relación receta-medicamento registrada con éxito" };
  }

  async findRecetasMedicamentos(query?: Query): Promise<RecetasMedicamentos[]> {
    return this.recetasMedicamentosRepository.findActive(query);
  }

  async findRecetasMedicamentosById(id: string): Promise<RecetasMedicamentos | null> {
    return this.recetasMedicamentosRepository.findById(id);
  }

  async findRecetasMedicamentosByReceta(recetaId: string): Promise<RecetasMedicamentos[]> {
    return this.recetasMedicamentosRepository.findActive({ receta: recetaId });
  }

  async updateRecetasMedicamentos(id: string, recetaMedicamento: Partial<RecetasMedicamentos>): Promise<{ recetaMedicamento: RecetasMedicamentos | null; message: string }> {
    const updatedRecetaMedicamento = await this.recetasMedicamentosRepository.update(id, recetaMedicamento);
    if (!updatedRecetaMedicamento) {
      return { recetaMedicamento: null, message: "Relación receta-medicamento no encontrada" };
    }
    return { recetaMedicamento: updatedRecetaMedicamento, message: "Relación receta-medicamento actualizada con éxito" };
  }

  async deleteRecetasMedicamentos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.recetasMedicamentosRepository.delete(id);
    return { success: deleted, message: deleted ? "Relación receta-medicamento eliminada físicamente" : "Relación receta-medicamento no encontrada" };
  }

  async softDeleteRecetasMedicamentos(id: string): Promise<{ success: boolean; message: string }> {
    const recetaMedicamento = await this.recetasMedicamentosRepository.findById(id);
    if (!recetaMedicamento) {
      return { success: false, message: "Relación receta-medicamento no encontrada" };
    }
    recetaMedicamento.estado = "Inactivo";
    await this.recetasMedicamentosRepository.update(id, recetaMedicamento);
    return { success: true, message: "Relación receta-medicamento cambiada a estado Inactivo" };
  }
}