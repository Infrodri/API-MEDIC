// src/services/MedicoService.ts
import { Query } from "types/RepositoryTypes";
import { IMedicoRepository, IMedicoService, Medico, PaginatedResult, PaginationOptions } from "types/MedicoTypes";

export class MedicoService implements IMedicoService {
  private medicoRepository: IMedicoRepository;

  constructor(medicoRepository: IMedicoRepository) {
    this.medicoRepository = medicoRepository;
  }

  async createMedico(medicoData: Omit<Medico, keyof Document>): Promise<{ medico: Medico; message: string }> {
    const newMedico = await this.medicoRepository.create({
      ...medicoData,
      estado: "Activo",
    });
    return { medico: newMedico, message: "Médico registrado con éxito" };
  }

  async findMedicos(query?: Query): Promise<Medico[]> {
    return this.medicoRepository.findActive(query);
  }

  async findMedicoById(id: string): Promise<Medico | null> {
    return this.medicoRepository.findById(id);
  }

  async findMedicoByCedula(cedula: string): Promise<Medico | null> {
    return this.medicoRepository.findOne({ cedula, estado: "Activo" });
  }

  async updateMedico(id: string, medico: Partial<Medico>): Promise<{ medico: Medico | null; message: string }> {
    const updatedMedico = await this.medicoRepository.update(id, medico);
    if (!updatedMedico) {
      return { medico: null, message: "Médico no encontrado" };
    }
    return { medico: updatedMedico, message: "Médico actualizado con éxito" };
  }

  async deleteMedico(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.medicoRepository.delete(id);
    return { success: deleted, message: deleted ? "Médico eliminado físicamente" : "Médico no encontrado" };
  }

  async softDeleteMedico(id: string): Promise<{ success: boolean; message: string }> {
    const medico = await this.medicoRepository.findById(id);
    if (!medico) {
      return { success: false, message: "Médico no encontrado" };
    }
    medico.estado = "Inactivo";
    await this.medicoRepository.update(id, medico);
    return { success: true, message: "Médico cambiado a estado Inactivo" };
  }

  async getDoctorsBySpecialty(): Promise<{ especialidad: string; count: number }[]> {
    return await this.medicoRepository.countBySpecialty();
  }

  async getActiveDoctorsToday(): Promise<number> {
    return await this.medicoRepository.countActiveToday();
  }

  async getTotalDoctors(): Promise<number> {
    return await this.medicoRepository.countTotal();
  }

  // Nuevos métodos
  async getDoctorsBySpecialtyId(especialidadId: string): Promise<Medico[]> {
    return await this.medicoRepository.findBySpecialty(especialidadId);
  }

  async getDoctorsByUserId(userId: string): Promise<Medico[]> {
    return await this.medicoRepository.findByUser(userId);
  }

  async getDoctorsWithMultipleSpecialties(): Promise<Medico[]> {
    return await this.medicoRepository.findWithMultipleSpecialties();
  }
  async findMedicosPaginated(query?: Query, options?: PaginationOptions): Promise<PaginatedResult<Medico>> {
    return await this.medicoRepository.findPaginated(query, options);
  }

  async toggleActiveStatus(id: string, estaActivo: boolean): Promise<{ medico: Medico | null; message: string }> {
    const updatedMedico = await this.medicoRepository.updateActiveStatus(id, estaActivo);
    if (!updatedMedico) {
      return { medico: null, message: "Médico no encontrado" };
    }
    return {
      medico: updatedMedico,
      message: `Estado activo del médico ${estaActivo ? "activado" : "desactivado"} con éxito`,
    };
  }
}