import { Query } from "types/RepositoryTypes";
import { IUsuarioRolesRepository, IUsuarioRolesService, UsuarioRoles } from "types/UsuarioRolesTypes";

export class UsuarioRolesService implements IUsuarioRolesService {
  private usuarioRolesRepository: IUsuarioRolesRepository;

  constructor(usuarioRolesRepository: IUsuarioRolesRepository) {
    this.usuarioRolesRepository = usuarioRolesRepository;
  }

  async createUsuarioRoles(usuarioRolData: Omit<UsuarioRoles, keyof Document>): Promise<{ usuarioRol: UsuarioRoles; message: string }> {
    const newUsuarioRol = await this.usuarioRolesRepository.create({
      ...usuarioRolData,
      estado: "Activo",
    });
    return { usuarioRol: newUsuarioRol, message: "Relación usuario-rol registrada con éxito" };
  }

  async findUsuarioRoles(query?: Query): Promise<UsuarioRoles[]> {
    return this.usuarioRolesRepository.findActive(query);
  }

  async findUsuarioRolesById(id: string): Promise<UsuarioRoles | null> {
    return this.usuarioRolesRepository.findById(id);
  }

  async findUsuarioRolesByUsuario(usuarioId: string): Promise<UsuarioRoles[]> {
    return this.usuarioRolesRepository.findActive({ usuario: usuarioId });
  }

  async updateUsuarioRoles(id: string, usuarioRol: Partial<UsuarioRoles>): Promise<{ usuarioRol: UsuarioRoles | null; message: string }> {
    const updatedUsuarioRol = await this.usuarioRolesRepository.update(id, usuarioRol);
    if (!updatedUsuarioRol) {
      return { usuarioRol: null, message: "Relación usuario-rol no encontrada" };
    }
    return { usuarioRol: updatedUsuarioRol, message: "Relación usuario-rol actualizada con éxito" };
  }

  async deleteUsuarioRoles(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.usuarioRolesRepository.delete(id);
    return { success: deleted, message: deleted ? "Relación usuario-rol eliminada físicamente" : "Relación usuario-rol no encontrada" };
  }

  async softDeleteUsuarioRoles(id: string): Promise<{ success: boolean; message: string }> {
    const usuarioRol = await this.usuarioRolesRepository.findById(id);
    if (!usuarioRol) {
      return { success: false, message: "Relación usuario-rol no encontrada" };
    }
    usuarioRol.estado = "Inactivo";
    await this.usuarioRolesRepository.update(id, usuarioRol);
    return { success: true, message: "Relación usuario-rol cambiada a estado Inactivo" };
  }
}