// src/services/ExamenesMedicosService.ts
import { Query } from "types/RepositoryTypes";
import { IExamenesMedicosRepository, IExamenesMedicosService, ExamenesMedicos } from "types/ExamenesMedicosTypes";

export class ExamenesMedicosService implements IExamenesMedicosService {
  private examenesMedicosRepository: IExamenesMedicosRepository;

  constructor(examenesMedicosRepository: IExamenesMedicosRepository) {
    this.examenesMedicosRepository = examenesMedicosRepository;
  }

  async createExamenesMedicos(examenData: Omit<ExamenesMedicos, keyof Document>): Promise<{ examen: ExamenesMedicos; message: string }> {
    const newExamen = await this.examenesMedicosRepository.create({
      ...examenData,
      estado: "Activo",
    });
    return { examen: newExamen, message: "Examen médico registrado con éxito" };
  }

  async findExamenesMedicos(query?: Query): Promise<ExamenesMedicos[]> {
    return this.examenesMedicosRepository.findActive(query);
  }

  async findExamenesMedicosById(id: string): Promise<ExamenesMedicos | null> {
    return this.examenesMedicosRepository.findById(id);
  }

  async findExamenesMedicosByNombre(nombre: string): Promise<ExamenesMedicos | null> {
    return this.examenesMedicosRepository.findOne({ nombre, estado: "Activo" }); // Usar "nombre"
  }

  async updateExamenesMedicos(id: string, examen: Partial<ExamenesMedicos>): Promise<{ examen: ExamenesMedicos | null; message: string }> {
    const updatedExamen = await this.examenesMedicosRepository.update(id, examen);
    if (!updatedExamen) {
      return { examen: null, message: "Examen médico no encontrado" };
    }
    return { examen: updatedExamen, message: "Examen médico actualizado con éxito" };
  }

  async deleteExamenesMedicos(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.examenesMedicosRepository.delete(id);
    return { success: deleted, message: deleted ? "Examen médico eliminado físicamente" : "Examen médico no encontrado" };
  }

  async softDeleteExamenesMedicos(id: string): Promise<{ success: boolean; message: string }> {
    const examen = await this.examenesMedicosRepository.findById(id);
    if (!examen) {
      return { success: false, message: "Examen médico no encontrado" };
    }
    await this.examenesMedicosRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Examen médico cambiado a estado Inactivo" };
  }
}