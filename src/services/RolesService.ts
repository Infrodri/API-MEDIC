import { Query } from "types/RepositoryTypes";
import { IRolesRepository, IRolesService, Roles } from "types/RolesTypes";

export class RolesService implements IRolesService {
  private rolesRepository: IRolesRepository;

  constructor(rolesRepository: IRolesRepository) {
    this.rolesRepository = rolesRepository;
  }

  async createRoles(rolesData: Omit<Roles, keyof Document>): Promise<Roles> {
    // Añadimos estado por defecto si no se proporciona
    const newRole = await this.rolesRepository.create({
      ...rolesData,
      estado: "Activo",
    });
    return newRole;
  }

  async findRoles(query?: Query): Promise<Roles[]> {
    // Cambiamos a findActive para listar solo roles activos
    return this.rolesRepository.findActive(query);
  }

  async findRolesById(id: string): Promise<Roles | null> {
    return this.rolesRepository.findById(id);
  }

  async updateRoles(id: string, roles: Partial<Roles>): Promise<Roles | null> {
    return this.rolesRepository.update(id, roles);
  }

  async deleteRoles(id: string): Promise<boolean> {
    return this.rolesRepository.delete(id);
  }

  // Método añadido para eliminación lógica
  async softDeleteRoles(id: string): Promise<{ success: boolean; message: string }> {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      return { success: false, message: "Rol no encontrado" };
    }
    role.estado = "Inactivo";
    await this.rolesRepository.update(id, role);
    return { success: true, message: "Rol cambiado a estado Inactivo" };
  }
}