import { Query } from "types/RepositoryTypes";
import { IPacienteAdiccionRepository, IPacienteAdiccionService, PacienteAdiccion } from "types/PacienteAdiccionesTypes";

export class PacienteAdiccionService implements IPacienteAdiccionService {
  private pacienteAdiccionRepository: IPacienteAdiccionRepository;

  constructor(pacienteAdiccionRepository: IPacienteAdiccionRepository) {
    this.pacienteAdiccionRepository = pacienteAdiccionRepository;
  }

  async createPacienteAdicciones(pacienteAdiccionData: Omit<PacienteAdiccion, keyof Document>): Promise<{ pacienteAdiccion: PacienteAdiccion; message: string }> {
    const newPacienteAdiccion = await this.pacienteAdiccionRepository.create({
      ...pacienteAdiccionData,
      estado: "Activo",
    });
    return { pacienteAdiccion: newPacienteAdiccion, message: "Adicción del paciente registrada con éxito" };
  }

  async findPacienteAdicciones(query?: Query): Promise<PacienteAdiccion[]> {
    return this.pacienteAdiccionRepository.findActive(query);
  }

  async findPacienteAdiccionesById(id: string): Promise<PacienteAdiccion | null> {
    return this.pacienteAdiccionRepository.findById(id);
  }

  async findPacienteAdiccionesByPaciente(pacienteId: string): Promise<PacienteAdiccion[]> {
    return this.pacienteAdiccionRepository.findByPaciente(pacienteId);
  }

  async updatePacienteAdicciones(id: string, pacienteAdiccion: Partial<PacienteAdiccion>): Promise<{ pacienteAdiccion: PacienteAdiccion | null; message: string }> {
    const updatedPacienteAdiccion = await this.pacienteAdiccionRepository.update(id, pacienteAdiccion);
    if (!updatedPacienteAdiccion) return { pacienteAdiccion: null, message: "Adicción del paciente no encontrada" };
    return { pacienteAdiccion: updatedPacienteAdiccion, message: "Adicción del paciente actualizada con éxito" };
  }

  async deletePacienteAdicciones(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteAdiccionRepository.delete(id);
    return { success: deleted, message: deleted ? "Adicción del paciente eliminada físicamente" : "Adicción del paciente no encontrada" };
  }

  async softDeletePacienteAdicciones(id: string): Promise<{ success: boolean; message: string }> {
    const pacienteAdiccion = await this.pacienteAdiccionRepository.findById(id);
    if (!pacienteAdiccion) return { success: false, message: "Adicción del paciente no encontrada" };
    pacienteAdiccion.estado = "Inactivo";
    await this.pacienteAdiccionRepository.update(id, pacienteAdiccion);
    return { success: true, message: "Adicción del paciente cambiada a estado Inactivo" };
  }
}