// src/services/PacienteService.ts
import { Query } from "types/RepositoryTypes";
import { PacienteAdiccionModel } from "@models/PacienteAdicciones";
import { PacienteExamenModel } from "@models/PacienteExamenes";
import { PacienteObstetricoGinecologicoModel } from "@models/PacienteObstetricosGinecologicos";
import { PacienteOperacionModel } from "@models/PacienteOperaciones";
import { ConsultasMedicasModel } from "@models/ConsultasMedicas";
import { HistorialMedico, IPacienteRepository, IPacienteService, Paciente } from "types/PacientesTypes";

export class PacienteService implements IPacienteService {
  private pacienteRepository: IPacienteRepository;

  constructor(pacienteRepository: IPacienteRepository) {
    this.pacienteRepository = pacienteRepository;
  }

  async createPaciente(pacienteData: Omit<Paciente, keyof Document>): Promise<{ paciente: Paciente; message: string }> {
    const newPaciente = await this.pacienteRepository.create({
      ...pacienteData,
      estado: "Activo",
      estadoAtencion: "Pendiente",
    });
    return { paciente: newPaciente, message: "Paciente registrado con éxito" };
  }

  async findPacientes(query?: Query): Promise<Paciente[]> {
    return this.pacienteRepository.findActive(query);
  }

  async findPacienteById(id: string): Promise<Paciente | null> {
    return this.pacienteRepository.findById(id);
  }

  async findPacienteByIdentifier(identifier: string): Promise<Paciente | null> {
    return this.pacienteRepository.findByIdentifier(identifier);
  }

  async findPacientesByEstadoAtencion(estado: string): Promise<Paciente[]> {
    return this.pacienteRepository.findByEstadoAtencion(estado);
  }

  async updatePaciente(id: string, paciente: Partial<Paciente>): Promise<{ paciente: Paciente | null; message: string }> {
    const updatedPaciente = await this.pacienteRepository.update(id, paciente);
    if (!updatedPaciente) return { paciente: null, message: "Paciente no encontrado" };
    return { paciente: updatedPaciente, message: "Paciente actualizado con éxito" };
  }

  async deletePaciente(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteRepository.delete(id);
    return { success: deleted, message: deleted ? "Paciente eliminado físicamente" : "Paciente no encontrado" };
  }

  async softDeletePaciente(id: string): Promise<{ success: boolean; message: string }> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) return { success: false, message: "Paciente no encontrado" };
    paciente.estado = "Inactivo";
    await this.pacienteRepository.update(id, paciente);
    return { success: true, message: "Paciente cambiado a estado Inactivo" };
  }

  async getHistorialMedico(pacienteId: string): Promise<HistorialMedico> {
    const paciente = await this.pacienteRepository.findById(pacienteId);
    if (!paciente) throw new Error("Paciente no encontrado");

    const adicciones = await PacienteAdiccionModel.find({ paciente: pacienteId, estado: "Activo" }).populate("tipoAdiccion").exec();
    const examenes = await PacienteExamenModel.find({ paciente: pacienteId, estado: "Activo" }).populate("examenMedico").exec();
    const obstetricosGinecologicos = await PacienteObstetricoGinecologicoModel.find({ paciente: pacienteId, estado: "Activo" }).populate("tipoObstetricoGinecologico").exec();
    const operaciones = await PacienteOperacionModel.find({ paciente: pacienteId, estado: "Activo" }).populate("tipoOperacionQuirurgica").exec();
    const consultas = await ConsultasMedicasModel.find({ paciente: pacienteId, estado: "Activo" }).populate("medico").populate("especialidad").exec();

    return { paciente, adicciones, examenes, obstetricosGinecologicos, operaciones, consultas };
  }
}