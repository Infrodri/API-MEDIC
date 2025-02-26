import { Query } from "types/RepositoryTypes";
import { IRecetasMedicasRepository, IRecetasMedicasService, RecetasMedicas } from "types/RecetasMedicasTypes";

export class RecetasMedicasService implements IRecetasMedicasService {
  private recetasMedicasRepository: IRecetasMedicasRepository;

  constructor(recetasMedicasRepository: IRecetasMedicasRepository) {
    this.recetasMedicasRepository = recetasMedicasRepository;
  }

  async createRecetasMedicas(recetaData: Omit<RecetasMedicas, keyof Document>): Promise<{ receta: RecetasMedicas; message: string }> {
    const newReceta = await this.recetasMedicasRepository.create({
      ...recetaData,
      estado: "Activo", // Default status is Active
    });
    return { receta: newReceta, message: "Receta médica registrada con éxito" };
  }

  async findRecetasMedicas(query?: Query): Promise<RecetasMedicas[]> {
    return this.recetasMedicasRepository.findActive(query);
  }

  async findRecetasMedicasById(id: string): Promise<RecetasMedicas | null> {
    return this.recetasMedicasRepository.findById(id);
  }

  async findRecetasMedicasByConsulta(consultaId: string): Promise<RecetasMedicas[]> {
    return this.recetasMedicasRepository.findActive({ consulta: consultaId });
  }

  async updateRecetasMedicas(id: string, receta: Partial<RecetasMedicas>): Promise<{ receta: RecetasMedicas | null; message: string }> {
    const updatedReceta = await this.recetasMedicasRepository.update(id, receta);
    if (!updatedReceta) {
      return { receta: null, message: "Receta médica no encontrada" };
    }
    return { receta: updatedReceta, message: "Receta médica actualizada con éxito" };
  }

  async deleteRecetasMedicas(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.recetasMedicasRepository.delete(id);
    return { success: deleted, message: deleted ? "Receta médica eliminada físicamente" : "Receta médica no encontrada" };
  }

  async softDeleteRecetasMedicas(id: string): Promise<{ success: boolean; message: string }> {
    const receta = await this.recetasMedicasRepository.findById(id);
    if (!receta) {
      return { success: false, message: "Receta médica no encontrada" };
    }
    receta.estado = "Inactivo";
    await this.recetasMedicasRepository.update(id, receta);
    return { success: true, message: "Receta médica cambiada a estado Inactivo" };
  }
}