import { Query } from "types/RepositoryTypes";
import { ITiposOperacionesQuirurgicasRepository, ITiposOperacionesQuirurgicasService, TiposOperacionesQuirurgicas } from "types/TiposOperacionesQuirurgicasTypes";

export class TiposOperacionesQuirurgicasService implements ITiposOperacionesQuirurgicasService {
  private tiposOperacionesQuirurgicasRepository: ITiposOperacionesQuirurgicasRepository;

  constructor(tiposOperacionesQuirurgicasRepository: ITiposOperacionesQuirurgicasRepository) {
    this.tiposOperacionesQuirurgicasRepository = tiposOperacionesQuirurgicasRepository;
  }

  async createTiposOperacionesQuirurgicas(tiposData: Omit<TiposOperacionesQuirurgicas, keyof Document>): Promise<{ tipos: TiposOperacionesQuirurgicas; message: string }> {
    const newTipos = await this.tiposOperacionesQuirurgicasRepository.create({
      ...tiposData,
      estado: "Activo", // Default status is Active
    });
    return { tipos: newTipos, message: "Tipo de operación quirúrgica registrado con éxito" };
  }

  async findTiposOperacionesQuirurgicas(query?: Query): Promise<TiposOperacionesQuirurgicas[]> {
    return this.tiposOperacionesQuirurgicasRepository.findActive(query);
  }

  async findTiposOperacionesQuirurgicasById(id: string): Promise<TiposOperacionesQuirurgicas | null> {
    return this.tiposOperacionesQuirurgicasRepository.findById(id);
  }

  async findTiposOperacionesQuirurgicasByNombre(nombreOperacion: string): Promise<TiposOperacionesQuirurgicas | null> {
    return this.tiposOperacionesQuirurgicasRepository.findOne({ nombreOperacion, estado: "Activo" });
  }

  async updateTiposOperacionesQuirurgicas(id: string, tipos: Partial<TiposOperacionesQuirurgicas>): Promise<{ tipos: TiposOperacionesQuirurgicas | null; message: string }> {
    const updatedTipos = await this.tiposOperacionesQuirurgicasRepository.update(id, tipos);
    if (!updatedTipos) {
      return { tipos: null, message: "Tipo de operación quirúrgica no encontrado" };
    }
    return { tipos: updatedTipos, message: "Tipo de operación quirúrgica actualizado con éxito" };
  }

  async deleteTiposOperacionesQuirurgicas(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.tiposOperacionesQuirurgicasRepository.delete(id);
    return { success: deleted, message: deleted ? "Tipo de operación quirúrgica eliminado físicamente" : "Tipo de operación quirúrgica no encontrado" };
  }

  async softDeleteTiposOperacionesQuirurgicas(id: string): Promise<{ success: boolean; message: string }> {
    const tipos = await this.tiposOperacionesQuirurgicasRepository.findById(id);
    if (!tipos) {
      return { success: false, message: "Tipo de operación quirúrgica no encontrado" };
    }
    tipos.estado = "Inactivo";
    await this.tiposOperacionesQuirurgicasRepository.update(id, tipos);
    return { success: true, message: "Tipo de operación quirúrgica cambiado a estado Inactivo" };
  }
}