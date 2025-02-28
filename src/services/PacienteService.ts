import { Query } from "types/RepositoryTypes";
import { IPacienteRepository, IPacienteService, Paciente } from "types/PacientesTypes";

export class PacienteService implements IPacienteService {
  private pacienteRepository: IPacienteRepository;

  constructor(pacienteRepository: IPacienteRepository) {
    this.pacienteRepository = pacienteRepository;
  }

  async createPaciente(pacienteData: Omit<Paciente, keyof Document>): Promise<{ paciente: Paciente; message: string }> {
    const newPaciente = await this.pacienteRepository.create({...pacienteData,
      estado: "Activo", // Default status is Active
    });
    return { paciente: newPaciente, message: "Paciente registrado con éxito" };
  }

  async findPacientes(query?: Query): Promise<Paciente[]> {
    return this.pacienteRepository.findActive(query);
  }

  async findPacienteById(id: string): Promise<Paciente | null> {
    return this.pacienteRepository.findById(id);
  }

  async findPacienteByCedula(cedula: string): Promise<Paciente | null> {
    return this.pacienteRepository.findOne({ cedula, estado: "Activo" });
  }

  async updatePaciente(id: string, paciente: Partial<Paciente>): Promise<{ paciente: Paciente | null; message: string }> {
    const updatedPaciente = await this.pacienteRepository.update(id, paciente);
    if (!updatedPaciente) {
      return { paciente: null, message: "Paciente no encontrado" };
    }
    return { paciente: updatedPaciente, message: "Paciente actualizado con éxito" };
  }

  async deletePaciente(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.pacienteRepository.delete(id);
    return { success: deleted, message: deleted ? "Paciente eliminado físicamente" : "Paciente no encontrado" };
  }

  async softDeletePaciente(id: string): Promise<{ success: boolean; message: string }> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      return { success: false, message: "Paciente no encontrado" };
    }
    paciente.estado = "Inactivo";
    await this.pacienteRepository.update(id, paciente);
    return { success: true, message: "Paciente cambiado a estado Inactivo" };
  }
}