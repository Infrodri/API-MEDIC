import { Query } from "types/RepositoryTypes";
import { IPacienteOperacionesRepository, IPacienteOperacionesService, PacienteOperaciones } from "types/PacienteOperacionesTypes";

export class PacienteOperacionesService implements IPacienteOperacionesService {
  private pacienteOperacionesRepository: IPacienteOperacionesRepository;

  constructor(pacienteOperacionesRepository: IPacienteOperacionesRepository) {
    this.pacienteOperacionesRepository = pacienteOperacionesRepository;
  }

  async createPacienteOperaciones(pacienteOpData: Omit<PacienteOperaciones, keyof Document>): Promise<{ pacienteOp: PacienteOperaciones; message: string }> {
    const newPacienteOp = await this.pacienteOperacionesRepository.create({
      ...pacienteOpData,
      estado: "Activo", // Default status is Active
    });
    return { pacienteOp: newPacienteOp, message: "Relación paciente-operación registrada con éxito" };
  }

  async findPacienteOperaciones(query?: Query): Promise<PacienteOperaciones[]> {
    return this.pacienteOperacionesRepository.findActive(query);
  }

  async findPacienteOperacionesById(id: string): Promise<PacienteOperaciones | null> {
    return this.pacienteOperacionesRepository.findById(id);
  }

  async findPacienteOperacionesByPaciente(pacienteId: string): Promise<PacienteOperaciones[]> {
    return this.pacienteOperacionesRepository.findActive({ paciente: pacienteId });
  }

  async updatePacienteOperaciones(id: string, pacienteOp: Partial<PacienteOperaciones>): Promise<{ pacienteOp: PacienteOperaciones | null; message: string }> {
    const updatedPacienteOp = await this.pacienteOperacionesRepository.update(id, pacienteOp);
    if (!updatedPacienteOp) {
      return { pacienteOp: null, message: "Relación paciente-operación no encontrada" };
    }
    return { pacienteOp: updatedPacienteOp, message: "Relación paciente-operación actualizada con éxito" };
  }

  async deletePacienteOperaciones(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteOperacionesRepository.delete(id);
    return { success: deleted, message: deleted ? "Relación paciente-operación eliminada físicamente" : "Relación paciente-operación no encontrada" };
  }

  async softDeletePacienteOperaciones(id: string): Promise<{ success: boolean; message: string }> {
    const pacienteOp = await this.pacienteOperacionesRepository.findById(id);
    if (!pacienteOp) {
      return { success: false, message: "Relación paciente-operación no encontrada" };
    }
    pacienteOp.estado = "Inactivo";
    await this.pacienteOperacionesRepository.update(id, pacienteOp);
    return { success: true, message: "Relación paciente-operación cambiada a estado Inactivo" };
  }
}