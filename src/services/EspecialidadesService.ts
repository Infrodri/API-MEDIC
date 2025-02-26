import { Query } from "types/RepositoryTypes";
import { IEspecialidadesRepository, IEspecialidadesService, Especialidades } from "types/EspecialidadesTypes";

export class EspecialidadesService implements IEspecialidadesService {
  private especialidadesRepository: IEspecialidadesRepository;

  constructor(especialidadesRepository: IEspecialidadesRepository) {
    this.especialidadesRepository = especialidadesRepository;
  }

  async createEspecialidades(especialidadData: Omit<Especialidades, keyof Document>): Promise<{ especialidad: Especialidades; message: string }> {
    const newEspecialidad = await this.especialidadesRepository.create({
      ...especialidadData,
      estado: "Activo",
    });
    return { especialidad: newEspecialidad, message: "Especialidad registrada con éxito" };
  }

  async findEspecialidades(query?: Query): Promise<Especialidades[]> {
    return this.especialidadesRepository.findActive(query);
  }

  async findEspecialidadesById(id: string): Promise<Especialidades | null> {
    return this.especialidadesRepository.findById(id);
  }

  async findEspecialidadesByNombre(nombre: string): Promise<Especialidades | null> {
    return this.especialidadesRepository.findOne({ nombre, estado: "Activo" });
  }

  async updateEspecialidades(id: string, especialidad: Partial<Especialidades>): Promise<{ especialidad: Especialidades | null; message: string }> {
    const updatedEspecialidad = await this.especialidadesRepository.update(id, especialidad);
    if (!updatedEspecialidad) {
      return { especialidad: null, message: "Especialidad no encontrada" };
    }
    return { especialidad: updatedEspecialidad, message: "Especialidad actualizada con éxito" };
  }

  async deleteEspecialidades(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.especialidadesRepository.delete(id);
    return { success: deleted, message: deleted ? "Especialidad eliminada físicamente" : "Especialidad no encontrada" };
  }

  async softDeleteEspecialidades(id: string): Promise<{ success: boolean; message: string }> {
    const especialidad = await this.especialidadesRepository.findById(id);
    if (!especialidad) {
      return { success: false, message: "Especialidad no encontrada" };
    }
    especialidad.estado = "Inactivo";
    await this.especialidadesRepository.update(id, especialidad);
    return { success: true, message: "Especialidad cambiada a estado Inactivo" };
  }
}