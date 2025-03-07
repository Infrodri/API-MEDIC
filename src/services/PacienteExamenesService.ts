import { Query } from "types/RepositoryTypes";
import { IPacienteExamenesRepository, IPacienteExamenesService, PacienteExamenes } from "types/PacienteExamenesTypes";

export class PacienteExamenesService implements IPacienteExamenesService {
  private pacienteExamenesRepository: IPacienteExamenesRepository;

  constructor(pacienteExamenesRepository: IPacienteExamenesRepository) {
    this.pacienteExamenesRepository = pacienteExamenesRepository;
  }

  async createPacienteExamenes(pacienteExamenData: Omit<PacienteExamenes, keyof Document>): Promise<{ pacienteExamen: PacienteExamenes; message: string }> {
    const newPacienteExamen = await this.pacienteExamenesRepository.create({
      ...pacienteExamenData,
      estado: "Activo",
    });
    return { pacienteExamen: newPacienteExamen, message: "Relación paciente-examen registrada con éxito" };
  }

  async findPacienteExamenes(query?: Query): Promise<PacienteExamenes[]> {
    return this.pacienteExamenesRepository.findActive(query);
  }

  async findPacienteExamenesById(id: string): Promise<PacienteExamenes | null> {
    return this.pacienteExamenesRepository.findById(id);
  }

  async findPacienteExamenesByPaciente(pacienteId: string): Promise<PacienteExamenes[]> {
    return this.pacienteExamenesRepository.findActive({ paciente: pacienteId });
  }

  async updatePacienteExamenes(id: string, pacienteExamen: Partial<PacienteExamenes>): Promise<{ pacienteExamen: PacienteExamenes | null; message: string }> {
    const updatedPacienteExamen = await this.pacienteExamenesRepository.update(id, pacienteExamen);
    if (!updatedPacienteExamen) {
      return { pacienteExamen: null, message: "Relación paciente-examen no encontrada" };
    }
    return { pacienteExamen: updatedPacienteExamen, message: "Relación paciente-examen actualizada con éxito" };
  }

  async deletePacienteExamenes(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteExamenesRepository.delete(id);
    return { success: deleted, message: deleted ? "Relación paciente-examen eliminada físicamente" : "Relación paciente-examen no encontrada" };
  }

  async softDeletePacienteExamenes(id: string): Promise<{ success: boolean; message: string }> {
    const pacienteExamen = await this.pacienteExamenesRepository.findById(id);
    if (!pacienteExamen) {
      return { success: false, message: "Relación paciente-examen no encontrada" };
    }
    pacienteExamen.estado = "Inactivo";
    await this.pacienteExamenesRepository.update(id, pacienteExamen);
    return { success: true, message: "Relación paciente-examen cambiada a estado Inactivo" };
  }
}