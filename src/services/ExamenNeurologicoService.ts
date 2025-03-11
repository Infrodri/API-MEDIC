import { Query } from "types/RepositoryTypes";
import { IExamenNeurologicoRepository, IExamenNeurologicoService, ExamenNeurologico } from "types/ExamenNeurologicoTypes";

export class ExamenNeurologicoService implements IExamenNeurologicoService {
  private examenNeurologicoRepository: IExamenNeurologicoRepository;

  constructor(examenNeurologicoRepository: IExamenNeurologicoRepository) {
    this.examenNeurologicoRepository = examenNeurologicoRepository;
  }

  async createExamenNeurologico(examenData: Omit<ExamenNeurologico, keyof Document>): Promise<{ examen: ExamenNeurologico; message: string }> {
    const newExamen = await this.examenNeurologicoRepository.create({
      ...examenData,
      estado: "Activo", // Estado por defecto
    });
    return { examen: newExamen, message: "Examen neurológico registrado con éxito" };
  }

  async findExamenNeurologico(query?: Query): Promise<ExamenNeurologico[]> {
    return this.examenNeurologicoRepository.findActive(query); // Solo exámenes activos
  }

  async findExamenNeurologicoById(id: string): Promise<ExamenNeurologico | null> {
    return this.examenNeurologicoRepository.findById(id);
  }

  async updateExamenNeurologico(id: string, examen: Partial<ExamenNeurologico>): Promise<{ examen: ExamenNeurologico | null; message: string }> {
    const updatedExamen = await this.examenNeurologicoRepository.update(id, examen);
    if (!updatedExamen) {
      return { examen: null, message: "Examen neurológico no encontrado" };
    }
    return { examen: updatedExamen, message: "Examen neurológico actualizado con éxito" };
  }

  async deleteExamenNeurologico(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.examenNeurologicoRepository.delete(id);
    return { success: deleted, message: deleted ? "Examen neurológico eliminado físicamente" : "Examen neurológico no encontrado" };
  }

  async softDeleteExamenNeurologico(id: string): Promise<{ success: boolean; message: string }> {
    const examen = await this.examenNeurologicoRepository.findById(id);
    if (!examen) {
      return { success: false, message: "Examen neurológico no encontrado" };
    }
    await this.examenNeurologicoRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Examen neurológico cambiado a estado Inactivo" };
  }
}