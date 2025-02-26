import { Query } from "types/RepositoryTypes";
import { IPacienteAdiccionesRepository, IPacienteAdiccionesService, PacienteAdicciones } from "types/PacienteAdiccionesTypes";

export class PacienteAdiccionesService implements IPacienteAdiccionesService {
  private pacienteAdiccionesRepository: IPacienteAdiccionesRepository;

  constructor(pacienteAdiccionesRepository: IPacienteAdiccionesRepository) {
    this.pacienteAdiccionesRepository = pacienteAdiccionesRepository;
  }

  async createPacienteAdicciones(pacienteAdiccionData: Omit<PacienteAdicciones, keyof Document>): Promise<{ pacienteAdiccion: PacienteAdicciones; message: string }> {
    const newPacienteAdiccion = await this.pacienteAdiccionesRepository.create({
      ...pacienteAdiccionData,
      estado: "Activo", // Default status is Active
    });
    return { pacienteAdiccion: newPacienteAdiccion, message: "Relación paciente-adicción registrada con éxito" };
  }

  async findPacienteAdicciones(query?: Query): Promise<PacienteAdicciones[]> {
    return this.pacienteAdiccionesRepository.findActive(query);
  }

  async findPacienteAdiccionesById(id: string): Promise<PacienteAdicciones | null> {
    return this.pacienteAdiccionesRepository.findById(id);
  }

  async findPacienteAdiccionesByPaciente(pacienteId: string): Promise<PacienteAdicciones[]> {
    return this.pacienteAdiccionesRepository.findActive({ paciente: pacienteId });
  }

  async updatePacienteAdicciones(id: string, pacienteAdiccion: Partial<PacienteAdicciones>): Promise<{ pacienteAdiccion: PacienteAdicciones | null; message: string }> {
    const updatedPacienteAdiccion = await this.pacienteAdiccionesRepository.update(id, pacienteAdiccion);
    if (!updatedPacienteAdiccion) {
      return { pacienteAdiccion: null, message: "Relación paciente-adicción no encontrada" };
    }
    return { pacienteAdiccion: updatedPacienteAdiccion, message: "Relación paciente-adicción actualizada con éxito" };
  }

  async deletePacienteAdicciones(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteAdiccionesRepository.delete(id);
    return { success: deleted, message: deleted ? "Relación paciente-adicción eliminada físicamente" : "Relación paciente-adicción no encontrada" };
  }

  async softDeletePacienteAdicciones(id: string): Promise<{ success: boolean; message: string }> {
    const pacienteAdiccion = await this.pacienteAdiccionesRepository.findById(id);
    if (!pacienteAdiccion) {
      return { success: false, message: "Relación paciente-adicción no encontrada" };
    }
    pacienteAdiccion.estado = "Inactivo";
    await this.pacienteAdiccionesRepository.update(id, pacienteAdiccion);
    return { success: true, message: "Relación paciente-adicción cambiada a estado Inactivo" };
  }
}