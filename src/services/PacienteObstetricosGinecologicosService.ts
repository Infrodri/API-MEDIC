// src/services/PacienteObstetricosGinecologicosService.ts
import { Query } from "types/RepositoryTypes";
import { IPacienteObstetricoGinecologicoRepository, IPacienteObstetricoGinecologicoService, PacienteObstetricoGinecologico } from "types/PacienteObstetricosGinecologicosTypes";

export class PacienteObstetricoGinecologicoService implements IPacienteObstetricoGinecologicoService {
  private pacienteObstetricoGinecologicoRepository: IPacienteObstetricoGinecologicoRepository;

  constructor(pacienteObstetricoGinecologicoRepository: IPacienteObstetricoGinecologicoRepository) {
    this.pacienteObstetricoGinecologicoRepository = pacienteObstetricoGinecologicoRepository;
  }

  async createPacienteObstetricoGinecologico(pacienteObstetricoGinecologicoData: Omit<PacienteObstetricoGinecologico, keyof Document>): Promise<{ pacienteObstetricoGinecologico: PacienteObstetricoGinecologico; message: string }> {
    const newPacienteObstetricoGinecologico = await this.pacienteObstetricoGinecologicoRepository.create({
      ...pacienteObstetricoGinecologicoData,
      estado: "Activo",
    });
    return { pacienteObstetricoGinecologico: newPacienteObstetricoGinecologico, message: "Registro obstétrico/ginecológico del paciente creado con éxito" };
  }

  async findPacienteObstetricosGinecologicos(query?: Query): Promise<PacienteObstetricoGinecologico[]> {
    return this.pacienteObstetricoGinecologicoRepository.findActive(query);
  }

  async findPacienteObstetricoGinecologicoById(id: string): Promise<PacienteObstetricoGinecologico | null> {
    return this.pacienteObstetricoGinecologicoRepository.findById(id);
  }

  async findPacienteObstetricosGinecologicosByPaciente(pacienteId: string): Promise<PacienteObstetricoGinecologico[]> {
    return this.pacienteObstetricoGinecologicoRepository.findByPaciente(pacienteId);
  }

  async updatePacienteObstetricoGinecologico(id: string, pacienteObstetricoGinecologico: Partial<PacienteObstetricoGinecologico>): Promise<{ pacienteObstetricoGinecologico: PacienteObstetricoGinecologico | null; message: string }> {
    const updatedPacienteObstetricoGinecologico = await this.pacienteObstetricoGinecologicoRepository.update(id, pacienteObstetricoGinecologico);
    if (!updatedPacienteObstetricoGinecologico) {
      return { pacienteObstetricoGinecologico: null, message: "Registro obstétrico/ginecológico del paciente no encontrado" };
    }
    return { pacienteObstetricoGinecologico: updatedPacienteObstetricoGinecologico, message: "Registro obstétrico/ginecológico del paciente actualizado con éxito" };
  }

  async deletePacienteObstetricoGinecologico(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteObstetricoGinecologicoRepository.delete(id);
    return { success: deleted, message: deleted ? "Registro obstétrico/ginecológico del paciente eliminado físicamente" : "Registro obstétrico/ginecológico del paciente no encontrado" };
  }

  async softDeletePacienteObstetricoGinecologico(id: string): Promise<{ success: boolean; message: string }> {
    const pacienteObstetricoGinecologico = await this.pacienteObstetricoGinecologicoRepository.findById(id);
    if (!pacienteObstetricoGinecologico) {
      return { success: false, message: "Registro obstétrico/ginecológico del paciente no encontrado" };
    }
    pacienteObstetricoGinecologico.estado = "Inactivo";
    await this.pacienteObstetricoGinecologicoRepository.update(id, pacienteObstetricoGinecologico);
    return { success: true, message: "Registro obstétrico/ginecológico del paciente cambiado a estado Inactivo" };
  }
}