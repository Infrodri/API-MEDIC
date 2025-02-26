import { Query } from "types/RepositoryTypes";
import { IRolesPermisosRepository, IRolesPermisosService, RolesPermisos } from "types/RolesPermisosTypes";

export class RolesPermisosService implements IRolesPermisosService {
  private rolesPermisosRepository: IRolesPermisosRepository;

  constructor(rolesPermisosRepository: IRolesPermisosRepository) {
    this.rolesPermisosRepository = rolesPermisosRepository;
  }

  async createRolesPermisos(rolPermisoData: Omit<RolesPermisos, keyof Document>): Promise<{ rolPermiso: RolesPermisos; message: string }> {
    const newRolPermiso = await this.rolesPermisosRepository.create({
      ...rolPermisoData,
      estado: "Activo",
    });
    return { rolPermiso: newRolPermiso, message: "Relación rol-permiso registrada con éxito" };
  }

  async findRolesPermisos(query?: Query): Promise<RolesPermisos[]> {
    return this.rolesPermisosRepository.findActive(query);
  }

  async findRolesPermisosById(id: string): Promise<RolesPermisos | null> {
    return this.rolesPermisosRepository.findById(id);
  }

  async findRolesPermisosByRol(rolId: string): Promise<RolesPermisos[]> {
    return this.rolesPermisosRepository.findActive({ rol: rolId });
  }

  async updateRolesPermisos(id: string, rolPermiso: Partial<RolesPermisos>): Promise<{ rolPermiso: RolesPermisos | null; message: string }> {
    const updatedRolPermiso = await this.rolesPermisosRepository.update(id, rolPermiso);
    if (!updatedRolPermiso) {
      return { rolPermiso: null, message: "Relación rol-permiso no encontrada" };
    }
    return { rolPermiso: updatedRolPermiso, message: "Relación rol-permiso actualizada con éxito" };
  }

  async deleteRolesPermisos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.rolesPermisosRepository.delete(id);
    return { success: deleted, message: deleted ? "Relación rol-permiso eliminada físicamente" : "Relación rol-permiso no encontrada" };
  }

  async softDeleteRolesPermisos(id: string): Promise<{ success: boolean; message: string }> {
    const rolPermiso = await this.rolesPermisosRepository.findById(id);
    if (!rolPermiso) {
      return { success: false, message: "Relación rol-permiso no encontrada" };
    }
    rolPermiso.estado = "Inactivo";
    await this.rolesPermisosRepository.update(id, rolPermiso);
    return { success: true, message: "Relación rol-permiso cambiada a estado Inactivo" };
  }
}