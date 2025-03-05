// src/services/PacienteOperacionesService.ts
import { Query } from "types/RepositoryTypes";
import { IPacienteOperacionRepository, IPacienteOperacionService, PacienteOperacion } from "types/PacienteOperacionesTypes";

export class PacienteOperacionService implements IPacienteOperacionService {
  private pacienteOperacionRepository: IPacienteOperacionRepository;

  constructor(pacienteOperacionRepository: IPacienteOperacionRepository) {
    this.pacienteOperacionRepository = pacienteOperacionRepository;
  }

  async createPacienteOperacion(pacienteOperacionData: Omit<PacienteOperacion, keyof Document>): Promise<{ pacienteOperacion: PacienteOperacion; message: string }> {
    const newPacienteOperacion = await this.pacienteOperacionRepository.create({
      ...pacienteOperacionData,
      estado: "Activo",
    });
    return { pacienteOperacion: newPacienteOperacion, message: "Operación del paciente registrada con éxito" };
  }

  async findPacienteOperaciones(query?: Query): Promise<PacienteOperacion[]> {
    return this.pacienteOperacionRepository.findActive(query);
  }

  async findPacienteOperacionById(id: string): Promise<PacienteOperacion | null> {
    return this.pacienteOperacionRepository.findById(id);
  }

  async findPacienteOperacionesByPaciente(pacienteId: string): Promise<PacienteOperacion[]> {
    return this.pacienteOperacionRepository.findByPaciente(pacienteId);
  }

  async updatePacienteOperacion(id: string, pacienteOperacion: Partial<PacienteOperacion>): Promise<{ pacienteOperacion: PacienteOperacion | null; message: string }> {
    const updatedPacienteOperacion = await this.pacienteOperacionRepository.update(id, pacienteOperacion);
    if (!updatedPacienteOperacion) {
      return { pacienteOperacion: null, message: "Operación del paciente no encontrada" };
    }
    return { pacienteOperacion: updatedPacienteOperacion, message: "Operación del paciente actualizada con éxito" };
  }

  async deletePacienteOperacion(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteOperacionRepository.delete(id);
    return { success: deleted, message: deleted ? "Operación del paciente eliminada físicamente" : "Operación del paciente no encontrada" };
  }

  async softDeletePacienteOperacion(id: string): Promise<{ success: boolean; message: string }> {
    const pacienteOperacion = await this.pacienteOperacionRepository.findById(id);
    if (!pacienteOperacion) {
      return { success: false, message: "Operación del paciente no encontrada" };
    }
    pacienteOperacion.estado = "Inactivo";
    await this.pacienteOperacionRepository.update(id, pacienteOperacion);
    return { success: true, message: "Operación del paciente cambiada a estado Inactivo" };
  }
}