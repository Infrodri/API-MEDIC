import { Query } from "types/RepositoryTypes";
import { ITiposObstetricosGinecologicosRepository, ITiposObstetricosGinecologicosService, TiposObstetricosGinecologicos } from "types/TiposObstetricosGinecologicosTypes";

export class TiposObstetricosGinecologicosService implements ITiposObstetricosGinecologicosService {
  private tiposObstetricosGinecologicosRepository: ITiposObstetricosGinecologicosRepository;

  constructor(tiposObstetricosGinecologicosRepository: ITiposObstetricosGinecologicosRepository) {
    this.tiposObstetricosGinecologicosRepository = tiposObstetricosGinecologicosRepository;
  }

  async createTiposObstetricosGinecologicos(tiposData: Omit<TiposObstetricosGinecologicos, keyof Document>): Promise<{ tipos: TiposObstetricosGinecologicos; message: string }> {
    const newTipos = await this.tiposObstetricosGinecologicosRepository.create({
      ...tiposData,
      estado: "Activo", // Default status is Active
    });
    return { tipos: newTipos, message: "Tipo obstétrico/ginecológico registrado con éxito" };
  }

  async findTiposObstetricosGinecologicos(query?: Query): Promise<TiposObstetricosGinecologicos[]> {
    return this.tiposObstetricosGinecologicosRepository.findActive(query);
  }

  async findTiposObstetricosGinecologicosById(id: string): Promise<TiposObstetricosGinecologicos | null> {
    return this.tiposObstetricosGinecologicosRepository.findById(id);
  }

  async findTiposObstetricosGinecologicosByNombre(nombreTipo: string): Promise<TiposObstetricosGinecologicos | null> {
    return this.tiposObstetricosGinecologicosRepository.findOne({ nombreTipo, estado: "Activo" });
  }

  async updateTiposObstetricosGinecologicos(id: string, tipos: Partial<TiposObstetricosGinecologicos>): Promise<{ tipos: TiposObstetricosGinecologicos | null; message: string }> {
    const updatedTipos = await this.tiposObstetricosGinecologicosRepository.update(id, tipos);
    if (!updatedTipos) {
      return { tipos: null, message: "Tipo obstétrico/ginecológico no encontrado" };
    }
    return { tipos: updatedTipos, message: "Tipo obstétrico/ginecológico actualizado con éxito" };
  }

  async deleteTiposObstetricosGinecologicos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.tiposObstetricosGinecologicosRepository.delete(id);
    return { success: deleted, message: deleted ? "Tipo obstétrico/ginecológico eliminado físicamente" : "Tipo obstétrico/ginecológico no encontrado" };
  }

  async softDeleteTiposObstetricosGinecologicos(id: string): Promise<{ success: boolean; message: string }> {
    const tipos = await this.tiposObstetricosGinecologicosRepository.findById(id);
    if (!tipos) {
      return { success: false, message: "Tipo obstétrico/ginecológico no encontrado" };
    }
    tipos.estado = "Inactivo";
    await this.tiposObstetricosGinecologicosRepository.update(id, tipos);
    return { success: true, message: "Tipo obstétrico/ginecológico cambiado a estado Inactivo" };
  }
}