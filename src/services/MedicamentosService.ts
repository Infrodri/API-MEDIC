import { Query } from "types/RepositoryTypes";
import { IMedicamentosRepository, IMedicamentosService, Medicamentos } from "types/MedicamentosTypes";

export class MedicamentosService implements IMedicamentosService {
  private medicamentosRepository: IMedicamentosRepository;

  constructor(medicamentosRepository: IMedicamentosRepository) {
    this.medicamentosRepository = medicamentosRepository;
  }

  async createMedicamentos(medicamentoData: Omit<Medicamentos, keyof Document>): Promise<{ medicamento: Medicamentos; message: string }> {
    const newMedicamento = await this.medicamentosRepository.create({
      ...medicamentoData,
      estado: "Activo", // Default status is Active
    });
    return { medicamento: newMedicamento, message: "Medicamento registrado con éxito" };
  }

  async findMedicamentos(query?: Query): Promise<Medicamentos[]> {
    return this.medicamentosRepository.findActive(query);
  }

  async findMedicamentosById(id: string): Promise<Medicamentos | null> {
    return this.medicamentosRepository.findById(id);
  }

  async findMedicamentosByNombre(nombreMedicamento: string): Promise<Medicamentos | null> {
    return this.medicamentosRepository.findOne({ nombreMedicamento, estado: "Activo" });
  }

  async updateMedicamentos(id: string, medicamento: Partial<Medicamentos>): Promise<{ medicamento: Medicamentos | null; message: string }> {
    const updatedMedicamento = await this.medicamentosRepository.update(id, medicamento);
    if (!updatedMedicamento) {
      return { medicamento: null, message: "Medicamento no encontrado" };
    }
    return { medicamento: updatedMedicamento, message: "Medicamento actualizado con éxito" };
  }

  async deleteMedicamentos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.medicamentosRepository.delete(id);
    return { success: deleted, message: deleted ? "Medicamento eliminado físicamente" : "Medicamento no encontrado" };
  }

  async softDeleteMedicamentos(id: string): Promise<{ success: boolean; message: string }> {
    const medicamento = await this.medicamentosRepository.findById(id);
    if (!medicamento) {
      return { success: false, message: "Medicamento no encontrado" };
    }
    medicamento.estado = "Inactivo";
    await this.medicamentosRepository.update(id, medicamento);
    return { success: true, message: "Medicamento cambiado a estado Inactivo" };
  }
}