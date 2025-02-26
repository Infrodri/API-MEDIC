import { Query } from "types/RepositoryTypes";
import { IFichasMedicasRepository, IFichasMedicasService, FichasMedicas } from "types/FichasMedicasTypes";

export class FichasMedicasService implements IFichasMedicasService {
  private fichasMedicasRepository: IFichasMedicasRepository;

  constructor(fichasMedicasRepository: IFichasMedicasRepository) {
    this.fichasMedicasRepository = fichasMedicasRepository;
  }

  async createFichasMedicas(fichaData: Omit<FichasMedicas, keyof Document>): Promise<{ ficha: FichasMedicas; message: string }> {
    const newFicha = await this.fichasMedicasRepository.create({
      ...fichaData,
      estado: "Activo", // Default status is Active
    });
    return { ficha: newFicha, message: "Ficha médica registrada con éxito" };
  }

  async findFichasMedicas(query?: Query): Promise<FichasMedicas[]> {
    return this.fichasMedicasRepository.findActive(query);
  }

  async findFichasMedicasById(id: string): Promise<FichasMedicas | null> {
    return this.fichasMedicasRepository.findById(id);
  }

  async findFichasMedicasByPaciente(pacienteId: string): Promise<FichasMedicas[]> {
    return this.fichasMedicasRepository.findActive({ paciente: pacienteId });
  }

  async updateFichasMedicas(id: string, ficha: Partial<FichasMedicas>): Promise<{ ficha: FichasMedicas | null; message: string }> {
    const updatedFicha = await this.fichasMedicasRepository.update(id, ficha);
    if (!updatedFicha) {
      return { ficha: null, message: "Ficha médica no encontrada" };
    }
    return { ficha: updatedFicha, message: "Ficha médica actualizada con éxito" };
  }

  async deleteFichasMedicas(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.fichasMedicasRepository.delete(id);
    return { success: deleted, message: deleted ? "Ficha médica eliminada físicamente" : "Ficha médica no encontrada" };
  }

  async softDeleteFichasMedicas(id: string): Promise<{ success: boolean; message: string }> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) {
      return { success: false, message: "Ficha médica no encontrada" };
    }
    ficha.estado = "Inactivo";
    await this.fichasMedicasRepository.update(id, ficha);
    return { success: true, message: "Ficha médica cambiada a estado Inactivo" };
  }
}