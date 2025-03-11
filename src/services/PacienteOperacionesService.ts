// src/services/PacienteOperacionService.ts
import { PacienteOperacionModel } from "@models/PacienteOperaciones"; // Ajustado el nombre del archivo
import { PacienteModel } from "@models/Pacientes";
import { IPacienteOperacionRepository, IPacienteOperacionService, PacienteOperacion } from "types/PacienteOperacionesTypes";
import { Query } from "types/RepositoryTypes";

export class PacienteOperacionService implements IPacienteOperacionService {
  private pacienteOperacionRepository: IPacienteOperacionRepository;

  constructor(pacienteOperacionRepository: IPacienteOperacionRepository) {
    this.pacienteOperacionRepository = pacienteOperacionRepository;
  }

  async createPacienteOperacion(pacienteOperacion: Partial<PacienteOperacion>): Promise<{ pacienteOperacion: PacienteOperacion; message: string }> {
    const pacienteExists = await PacienteModel.findById(pacienteOperacion.paciente);
    if (!pacienteExists) throw new Error("Paciente no encontrado");

    const tipoOperacionExists = await PacienteOperacionModel.db.model("TiposOperacionesQuirurgicas").findById(pacienteOperacion.tipoOperacionQuirurgica);
    if (!tipoOperacionExists) throw new Error("Tipo de operación quirúrgica no encontrado");

    const newPacienteOperacion = await this.pacienteOperacionRepository.create({
      paciente: pacienteOperacion.paciente,
      tipoOperacionQuirurgica: pacienteOperacion.tipoOperacionQuirurgica,
      fechaOperacion: pacienteOperacion.fechaOperacion, // Incluimos fechaOperacion, requerido
      observaciones: pacienteOperacion.observaciones,   // Opcional
      estado: "Activo",
    } as PacienteOperacion);

    return { pacienteOperacion: newPacienteOperacion, message: "Operación quirúrgica creada con éxito" };
  }

  async findPacienteOperacion(query?: Query): Promise<PacienteOperacion[]> {
    return this.pacienteOperacionRepository.findActive(query);
  }

  async findPacienteOperacionById(id: string): Promise<PacienteOperacion | null> {
    const operacion = await this.pacienteOperacionRepository.findById(id);
    if (!operacion) throw new Error("Operación quirúrgica no encontrada");
    return operacion;
  }

  async findPacienteOperacionByPaciente(pacienteId: string): Promise<PacienteOperacion[]> {
    const pacienteExists = await PacienteModel.findById(pacienteId);
    if (!pacienteExists) throw new Error("Paciente no encontrado");
    return this.pacienteOperacionRepository.findByPaciente(pacienteId);
  }

  async updatePacienteOperacion(id: string, pacienteOperacion: Partial<PacienteOperacion>): Promise<{ pacienteOperacion: PacienteOperacion | null; message: string }> {
    const updatedOperacion = await this.pacienteOperacionRepository.update(id, pacienteOperacion);
    if (!updatedOperacion) throw new Error("Operación quirúrgica no encontrada");
    return { pacienteOperacion: updatedOperacion, message: "Operación quirúrgica actualizada con éxito" };
  }

  async deletePacienteOperacion(id: string): Promise<{ success: boolean; message: string }> {
    const success = await this.pacienteOperacionRepository.delete(id);
    if (!success) throw new Error("Operación quirúrgica no encontrada");
    return { success: true, message: "Operación quirúrgica eliminada con éxito" };
  }

  async softDeletePacienteOperacion(id: string): Promise<{ success: boolean; message: string }> {
    const operacion = await this.pacienteOperacionRepository.findById(id);
    if (!operacion) throw new Error("Operación quirúrgica no encontrada");
    await this.pacienteOperacionRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Operación quirúrgica desactivada con éxito" };
  }
}