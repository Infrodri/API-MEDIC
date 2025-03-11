import { Query } from "types/RepositoryTypes";
import { IAntecedentesPersonalesRepository, IAntecedentesPersonalesService, AntecedentesPersonales } from "types/AntecedentesPersonalesTypes";

export class AntecedentesPersonalesService implements IAntecedentesPersonalesService {
  private antecedentesPersonalesRepository: IAntecedentesPersonalesRepository;

  constructor(antecedentesPersonalesRepository: IAntecedentesPersonalesRepository) {
    this.antecedentesPersonalesRepository = antecedentesPersonalesRepository;
  }

  async createAntecedentesPersonales(antecedenteData: Omit<AntecedentesPersonales, keyof Document>): Promise<{ antecedente: AntecedentesPersonales; message: string }> {
    const newAntecedente = await this.antecedentesPersonalesRepository.create({
      ...antecedenteData,
      estado: "Activo", // Estado por defecto
    });
    return { antecedente: newAntecedente, message: "Antecedente personal registrado con éxito" };
  }

  async findAntecedentesPersonales(query?: Query): Promise<AntecedentesPersonales[]> {
    return this.antecedentesPersonalesRepository.findActive(query); // Solo registros activos
  }

  async findAntecedentesPersonalesById(id: string): Promise<AntecedentesPersonales | null> {
    return this.antecedentesPersonalesRepository.findById(id);
  }

  async updateAntecedentesPersonales(id: string, antecedente: Partial<AntecedentesPersonales>): Promise<{ antecedente: AntecedentesPersonales | null; message: string }> {
    const updatedAntecedente = await this.antecedentesPersonalesRepository.update(id, antecedente);
    if (!updatedAntecedente) {
      return { antecedente: null, message: "Antecedente personal no encontrado" };
    }
    return { antecedente: updatedAntecedente, message: "Antecedente personal actualizado con éxito" };
  }

  async deleteAntecedentesPersonales(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.antecedentesPersonalesRepository.delete(id);
    return { success: deleted, message: deleted ? "Antecedente personal eliminado físicamente" : "Antecedente personal no encontrado" };
  }

  async softDeleteAntecedentesPersonales(id: string): Promise<{ success: boolean; message: string }> {
    const antecedente = await this.antecedentesPersonalesRepository.findById(id);
    if (!antecedente) {
      return { success: false, message: "Antecedente personal no encontrado" };
    }
    await this.antecedentesPersonalesRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Antecedente personal cambiado a estado Inactivo" };
  }
}