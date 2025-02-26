import { Query } from "types/RepositoryTypes";
import { IAdministrativosRepository, IAdministrativosService, Administrativos } from "types/AdministrativosTypes";

export class AdministrativosService implements IAdministrativosService {
  private administrativosRepository: IAdministrativosRepository;

  constructor(administrativosRepository: IAdministrativosRepository) {
    this.administrativosRepository = administrativosRepository;
  }

  async createAdministrativos(administrativoData: Omit<Administrativos, keyof Document>): Promise<{ administrativo: Administrativos; message: string }> {
    const newAdministrativo = await this.administrativosRepository.create({
      ...administrativoData,
      estado: "Activo",
    });
    return { administrativo: newAdministrativo, message: "Administrativo registrado con éxito" };
  }

  async findAdministrativos(query?: Query): Promise<Administrativos[]> {
    return this.administrativosRepository.findActive(query);
  }

  async findAdministrativosById(id: string): Promise<Administrativos | null> {
    return this.administrativosRepository.findById(id);
  }

  async findAdministrativosByCedula(cedula: string): Promise<Administrativos | null> {
    return this.administrativosRepository.findOne({ cedula, estado: "Activo" });
  }

  async updateAdministrativos(id: string, administrativo: Partial<Administrativos>): Promise<{ administrativo: Administrativos | null; message: string }> {
    const updatedAdministrativo = await this.administrativosRepository.update(id, administrativo);
    if (!updatedAdministrativo) {
      return { administrativo: null, message: "Administrativo no encontrado" };
    }
    return { administrativo: updatedAdministrativo, message: "Administrativo actualizado con éxito" };
  }

  async deleteAdministrativos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.administrativosRepository.delete(id);
    return { success: deleted, message: deleted ? "Administrativo eliminado físicamente" : "Administrativo no encontrado" };
  }

  async softDeleteAdministrativos(id: string): Promise<{ success: boolean; message: string }> {
    const administrativo = await this.administrativosRepository.findById(id);
    if (!administrativo) {
      return { success: false, message: "Administrativo no encontrado" };
    }
    administrativo.estado = "Inactivo";
    await this.administrativosRepository.update(id, administrativo);
    return { success: true, message: "Administrativo cambiado a estado Inactivo" };
  }
}