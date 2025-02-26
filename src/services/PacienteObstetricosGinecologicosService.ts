import { Query } from "types/RepositoryTypes";
import { IPacienteObstetricosGinecologicosRepository, IPacienteObstetricosGinecologicosService, PacienteObstetricosGinecologicos } from "types/PacienteObstetricosGinecologicosTypes";

export class PacienteObstetricosGinecologicosService implements IPacienteObstetricosGinecologicosService {
  private pacienteObstetricosGinecologicosRepository: IPacienteObstetricosGinecologicosRepository;

  constructor(pacienteObstetricosGinecologicosRepository: IPacienteObstetricosGinecologicosRepository) {
    this.pacienteObstetricosGinecologicosRepository = pacienteObstetricosGinecologicosRepository;
  }

  async createPacienteObstetricosGinecologicos(pacienteOGData: Omit<PacienteObstetricosGinecologicos, keyof Document>): Promise<{ pacienteOG: PacienteObstetricosGinecologicos; message: string }> {
    const newPacienteOG = await this.pacienteObstetricosGinecologicosRepository.create({
      ...pacienteOGData,
      estado: "Activo", // Default status is Active
    });
    return { pacienteOG: newPacienteOG, message: "Relación paciente-obstétrico/ginecológico registrada con éxito" };
  }

  async findPacienteObstetricosGinecologicos(query?: Query): Promise<PacienteObstetricosGinecologicos[]> {
    return this.pacienteObstetricosGinecologicosRepository.findActive(query);
  }

  async findPacienteObstetricosGinecologicosById(id: string): Promise<PacienteObstetricosGinecologicos | null> {
    return this.pacienteObstetricosGinecologicosRepository.findById(id);
  }

  async findPacienteObstetricosGinecologicosByPaciente(pacienteId: string): Promise<PacienteObstetricosGinecologicos[]> {
    return this.pacienteObstetricosGinecologicosRepository.findActive({ paciente: pacienteId });
  }

  async updatePacienteObstetricosGinecologicos(id: string, pacienteOG: Partial<PacienteObstetricosGinecologicos>): Promise<{ pacienteOG: PacienteObstetricosGinecologicos | null; message: string }> {
    const updatedPacienteOG = await this.pacienteObstetricosGinecologicosRepository.update(id, pacienteOG);
    if (!updatedPacienteOG) {
      return { pacienteOG: null, message: "Relación paciente-obstétrico/ginecológico no encontrada" };
    }
    return { pacienteOG: updatedPacienteOG, message: "Relación paciente-obstétrico/ginecológico actualizada con éxito" };
  }

  async deletePacienteObstetricosGinecologicos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteObstetricosGinecologicosRepository.delete(id);
    return { success: deleted, message: deleted ? "Relación paciente-obstétrico/ginecológico eliminada físicamente" : "Relación paciente-obstétrico/ginecológico no encontrada" };
  }

  async softDeletePacienteObstetricosGinecologicos(id: string): Promise<{ success: boolean; message: string }> {
    const pacienteOG = await this.pacienteObstetricosGinecologicosRepository.findById(id);
    if (!pacienteOG) {
      return { success: false, message: "Relación paciente-obstétrico/ginecológico no encontrada" };
    }
    pacienteOG.estado = "Inactivo";
    await this.pacienteObstetricosGinecologicosRepository.update(id, pacienteOG);
    return { success: true, message: "Relación paciente-obstétrico/ginecológico cambiada a estado Inactivo" };
  }
}