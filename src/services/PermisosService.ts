import { Query } from "types/RepositoryTypes";
import { IPermisosRepository, IPermisosService, Permisos } from "types/PermisosTypes";

export class PermisosService implements IPermisosService {
  private permisosRepository: IPermisosRepository;

  constructor(permisosRepository: IPermisosRepository) {
    this.permisosRepository = permisosRepository;
  }

  async createPermisos(permisoData: Omit<Permisos, keyof Document>): Promise<{ permiso: Permisos; message: string }> {
    const newPermiso = await this.permisosRepository.create({
      ...permisoData,
      estado: "Activo",
    });
    return { permiso: newPermiso, message: "Permiso registrado con éxito" };
  }

  async findPermisos(query?: Query): Promise<Permisos[]> {
    return this.permisosRepository.findActive(query);
  }

  async findPermisosById(id: string): Promise<Permisos | null> {
    return this.permisosRepository.findById(id);
  }

  async findPermisosByNombre(nombre: string): Promise<Permisos | null> {
    return this.permisosRepository.findOne({ nombre, estado: "Activo" });
  }

  async updatePermisos(id: string, permiso: Partial<Permisos>): Promise<{ permiso: Permisos | null; message: string }> {
    const updatedPermiso = await this.permisosRepository.update(id, permiso);
    if (!updatedPermiso) {
      return { permiso: null, message: "Permiso no encontrado" };
    }
    return { permiso: updatedPermiso, message: "Permiso actualizado con éxito" };
  }

  async deletePermisos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.permisosRepository.delete(id);
    return { success: deleted, message: deleted ? "Permiso eliminado físicamente" : "Permiso no encontrado" };
  }

  async softDeletePermisos(id: string): Promise<{ success: boolean; message: string }> {
    const permiso = await this.permisosRepository.findById(id);
    if (!permiso) {
      return { success: false, message: "Permiso no encontrado" };
    }
    permiso.estado = "Inactivo";
    await this.permisosRepository.update(id, permiso);
    return { success: true, message: "Permiso cambiado a estado Inactivo" };
  }
}