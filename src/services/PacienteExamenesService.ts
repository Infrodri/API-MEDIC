// src/services/PacienteExamenesService.ts
import { Query } from "types/RepositoryTypes";
import { IPacienteExamenRepository, IPacienteExamenService, PacienteExamen } from "types/PacienteExamenesTypes";

export class PacienteExamenService implements IPacienteExamenService {
  private pacienteExamenRepository: IPacienteExamenRepository;

  constructor(pacienteExamenRepository: IPacienteExamenRepository) {
    this.pacienteExamenRepository = pacienteExamenRepository;
  }

  async createPacienteExamen(pacienteExamenData: Omit<PacienteExamen, keyof Document>): Promise<{ pacienteExamen: PacienteExamen; message: string }> {
    const newPacienteExamen = await this.pacienteExamenRepository.create({
      ...pacienteExamenData,
      estado: "Activo",
    });
    return { pacienteExamen: newPacienteExamen, message: "Examen del paciente registrado con éxito" };
  }

  async findPacienteExamenes(query?: Query): Promise<PacienteExamen[]> {
    return this.pacienteExamenRepository.findActive(query);
  }

  async findPacienteExamenById(id: string): Promise<PacienteExamen | null> {
    return this.pacienteExamenRepository.findById(id);
  }

  async findPacienteExamenesByPaciente(pacienteId: string): Promise<PacienteExamen[]> {
    return this.pacienteExamenRepository.findByPaciente(pacienteId);
  }

  async updatePacienteExamen(id: string, pacienteExamen: Partial<PacienteExamen>): Promise<{ pacienteExamen: PacienteExamen | null; message: string }> {
    const updatedPacienteExamen = await this.pacienteExamenRepository.update(id, pacienteExamen);
    if (!updatedPacienteExamen) {
      return { pacienteExamen: null, message: "Examen del paciente no encontrado" };
    }
    return { pacienteExamen: updatedPacienteExamen, message: "Examen del paciente actualizado con éxito" };
  }

  async deletePacienteExamen(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteExamenRepository.delete(id);
    return { success: deleted, message: deleted ? "Examen del paciente eliminado físicamente" : "Examen del paciente no encontrado" };
  }

  async softDeletePacienteExamen(id: string): Promise<{ success: boolean; message: string }> {
    const pacienteExamen = await this.pacienteExamenRepository.findById(id);
    if (!pacienteExamen) {
      return { success: false, message: "Examen del paciente no encontrado" };
    }
    pacienteExamen.estado = "Inactivo";
    await this.pacienteExamenRepository.update(id, pacienteExamen);
    return { success: true, message: "Examen del paciente cambiado a estado Inactivo" };
  }
}