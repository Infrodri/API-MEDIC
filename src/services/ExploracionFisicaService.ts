import { Query } from "types/RepositoryTypes";
import { IExploracionFisicaRepository, IExploracionFisicaService, ExploracionFisica } from "types/ExploracionFisicaTypes";

export class ExploracionFisicaService implements IExploracionFisicaService {
  private exploracionFisicaRepository: IExploracionFisicaRepository;

  constructor(exploracionFisicaRepository: IExploracionFisicaRepository) {
    this.exploracionFisicaRepository = exploracionFisicaRepository;
  }

  async createExploracionFisica(exploracionData: Omit<ExploracionFisica, keyof Document>): Promise<{ exploracion: ExploracionFisica; message: string }> {
    const newExploracion = await this.exploracionFisicaRepository.create({
      ...exploracionData,
      estado: "Activo", // Estado por defecto
    });
    return { exploracion: newExploracion, message: "Exploración física registrada con éxito" };
  }

  async findExploracionFisica(query?: Query): Promise<ExploracionFisica[]> {
    return this.exploracionFisicaRepository.findActive(query); // Solo registros activos
  }

  async findExploracionFisicaById(id: string): Promise<ExploracionFisica | null> {
    return this.exploracionFisicaRepository.findById(id);
  }

  async updateExploracionFisica(id: string, exploracion: Partial<ExploracionFisica>): Promise<{ exploracion: ExploracionFisica | null; message: string }> {
    const updatedExploracion = await this.exploracionFisicaRepository.update(id, exploracion);
    if (!updatedExploracion) {
      return { exploracion: null, message: "Exploración física no encontrada" };
    }
    return { exploracion: updatedExploracion, message: "Exploración física actualizada con éxito" };
  }

  async deleteExploracionFisica(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.exploracionFisicaRepository.delete(id);
    return { success: deleted, message: deleted ? "Exploración física eliminada físicamente" : "Exploración física no encontrada" };
  }

  async softDeleteExploracionFisica(id: string): Promise<{ success: boolean; message: string }> {
    const exploracion = await this.exploracionFisicaRepository.findById(id);
    if (!exploracion) {
      return { success: false, message: "Exploración física no encontrada" };
    }
    await this.exploracionFisicaRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Exploración física cambiada a estado Inactivo" };
  }
}