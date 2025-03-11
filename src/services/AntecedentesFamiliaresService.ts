import { Query } from "types/RepositoryTypes";
import { IAntecedentesFamiliaresRepository, IAntecedentesFamiliaresService, AntecedentesFamiliares } from "types/AntecedentesFamiliaresTypes";

export class AntecedentesFamiliaresService implements IAntecedentesFamiliaresService {
  private antecedentesFamiliaresRepository: IAntecedentesFamiliaresRepository;

  constructor(antecedentesFamiliaresRepository: IAntecedentesFamiliaresRepository) {
    this.antecedentesFamiliaresRepository = antecedentesFamiliaresRepository;
  }

  async createAntecedentesFamiliares(antecedenteData: Omit<AntecedentesFamiliares, keyof Document>): Promise<{ antecedente: AntecedentesFamiliares; message: string }> {
    const newAntecedente = await this.antecedentesFamiliaresRepository.create({
      ...antecedenteData,
      estado: "Activo",
    });
    return { antecedente: newAntecedente, message: "Antecedente familiar registrado con éxito" };
  }

  async findAntecedentesFamiliares(query?: Query): Promise<AntecedentesFamiliares[]> {
    return this.antecedentesFamiliaresRepository.findActive(query);
  }

  async findAntecedentesFamiliaresById(id: string): Promise<AntecedentesFamiliares | null> {
    return this.antecedentesFamiliaresRepository.findById(id);
  }

  async updateAntecedentesFamiliares(id: string, antecedente: Partial<AntecedentesFamiliares>): Promise<{ antecedente: AntecedentesFamiliares | null; message: string }> {
    const updatedAntecedente = await this.antecedentesFamiliaresRepository.update(id, antecedente);
    if (!updatedAntecedente) {
      return { antecedente: null, message: "Antecedente familiar no encontrado" };
    }
    return { antecedente: updatedAntecedente, message: "Antecedente familiar actualizado con éxito" };
  }

  async deleteAntecedentesFamiliares(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.antecedentesFamiliaresRepository.delete(id);
    return { success: deleted, message: deleted ? "Antecedente familiar eliminado físicamente" : "Antecedente familiar no encontrado" };
  }

  async softDeleteAntecedentesFamiliares(id: string): Promise<{ success: boolean; message: string }> {
    const antecedente = await this.antecedentesFamiliaresRepository.findById(id);
    if (!antecedente) {
      return { success: false, message: "Antecedente familiar no encontrado" };
    }
    await this.antecedentesFamiliaresRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Antecedente familiar cambiado a estado Inactivo" };
  }
}