import { Query } from "types/RepositoryTypes";
import { IOrganosSentidosRepository, IOrganosSentidosService, OrganosSentidos } from "types/OrganosSentidosTypes";

export class OrganosSentidosService implements IOrganosSentidosService {
  private organosSentidosRepository: IOrganosSentidosRepository;

  constructor(organosSentidosRepository: IOrganosSentidosRepository) {
    this.organosSentidosRepository = organosSentidosRepository;
  }

  async createOrganosSentidos(organoData: Omit<OrganosSentidos, keyof Document>): Promise<{ organo: OrganosSentidos; message: string }> {
    const newOrgano = await this.organosSentidosRepository.create({
      ...organoData,
      estado: "Activo", // Estado por defecto
    });
    return { organo: newOrgano, message: "Evaluación de órganos de sentidos registrada con éxito" };
  }

  async findOrganosSentidos(query?: Query): Promise<OrganosSentidos[]> {
    return this.organosSentidosRepository.findActive(query); // Solo registros activos
  }

  async findOrganosSentidosById(id: string): Promise<OrganosSentidos | null> {
    return this.organosSentidosRepository.findById(id);
  }

  async updateOrganosSentidos(id: string, organo: Partial<OrganosSentidos>): Promise<{ organo: OrganosSentidos | null; message: string }> {
    const updatedOrgano = await this.organosSentidosRepository.update(id, organo);
    if (!updatedOrgano) {
      return { organo: null, message: "Evaluación de órganos de sentidos no encontrada" };
    }
    return { organo: updatedOrgano, message: "Evaluación de órganos de sentidos actualizada con éxito" };
  }

  async deleteOrganosSentidos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.organosSentidosRepository.delete(id);
    return { success: deleted, message: deleted ? "Evaluación de órganos de sentidos eliminada físicamente" : "Evaluación de órganos de sentidos no encontrada" };
  }

  async softDeleteOrganosSentidos(id: string): Promise<{ success: boolean; message: string }> {
    const organo = await this.organosSentidosRepository.findById(id);
    if (!organo) {
      return { success: false, message: "Evaluación de órganos de sentidos no encontrada" };
    }
    await this.organosSentidosRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Evaluación de órganos de sentidos cambiada a estado Inactivo" };
  }
}