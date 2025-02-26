import { Query } from "types/RepositoryTypes";
import { ITiposAdiccionRepository, ITiposAdiccionService, TiposAdiccion } from "types/TiposAdiccionesTypes";

export class TiposAdiccionesService implements ITiposAdiccionService {
  private tiposAdiccionRepository: ITiposAdiccionRepository;

  constructor(tiposAdiccionRepository: ITiposAdiccionRepository) {
    this.tiposAdiccionRepository = tiposAdiccionRepository;
  }

  async createTiposAdiccion(tiposAdiccionData: Omit<TiposAdiccion, keyof Document>): Promise<{ tiposAdiccion: TiposAdiccion; message: string }> {
    const newTiposAdiccion = await this.tiposAdiccionRepository.create({
      ...tiposAdiccionData,
      estado: "Activo", // Default status is Active
    });
    return { tiposAdiccion: newTiposAdiccion, message: "Tipo de adicción registrado con éxito" };
  }

  async findTiposAdicciones(query?: Query): Promise<TiposAdiccion[]> {
    return this.tiposAdiccionRepository.findActive(query);
  }

  async findTiposAdiccionById(id: string): Promise<TiposAdiccion | null> {
    return this.tiposAdiccionRepository.findById(id);
  }

  async findTiposAdiccionByNombre(nombreAdiccion: string): Promise<TiposAdiccion | null> {
    return this.tiposAdiccionRepository.findOne({ nombreAdiccion, estado: "Activo" });
  }

  async updateTiposAdiccion(id: string, tiposAdiccion: Partial<TiposAdiccion>): Promise<{ tiposAdiccion: TiposAdiccion | null; message: string }> {
    const updatedTiposAdiccion = await this.tiposAdiccionRepository.update(id, tiposAdiccion);
    if (!updatedTiposAdiccion) {
      return { tiposAdiccion: null, message: "Tipo de adicción no encontrado" };
    }
    return { tiposAdiccion: updatedTiposAdiccion, message: "Tipo de adicción actualizado con éxito" };
  }

  async deleteTiposAdiccion(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.tiposAdiccionRepository.delete(id);
    return { success: deleted, message: deleted ? "Tipo de adicción eliminado físicamente" : "Tipo de adicción no encontrado" };
  }

  async softDeleteTiposAdiccion(id: string): Promise<{ success: boolean; message: string }> {
    const tiposAdiccion = await this.tiposAdiccionRepository.findById(id);
    if (!tiposAdiccion) {
      return { success: false, message: "Tipo de adicción no encontrado" };
    }
    tiposAdiccion.estado = "Inactivo";
    await this.tiposAdiccionRepository.update(id, tiposAdiccion);
    return { success: true, message: "Tipo de adicción cambiado a estado Inactivo" };
  }
}