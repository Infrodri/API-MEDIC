// src/services/HistorialMedicoService.ts
import { IHistorialMedicoRepository } from "../repositories/HistorialMedicoRepository";
import { IHistorialMedicoService, HistorialMedico } from "../types/HistorialMedicoTypes";
import { MedicoModel } from "../models/Medicos";
import { UserModel } from "@models/Users";

export class HistorialMedicoService implements IHistorialMedicoService {
  private historialMedicoRepository: IHistorialMedicoRepository;

  constructor(historialMedicoRepository: IHistorialMedicoRepository) {
    this.historialMedicoRepository = historialMedicoRepository;
  }

  async getHistorialByPaciente(pacienteId: string): Promise<HistorialMedico[]> {
    return this.historialMedicoRepository.findByPaciente(pacienteId);
  }

  async addHistorialEntry(
    pacienteId: string,
    entry: Omit<HistorialMedico, "_id" | "paciente" | "createdAt" | "updatedAt">,
    userId: string // Nuevo parámetro para el ID del usuario autenticado
  ): Promise<HistorialMedico> {
    // Buscar el usuario autenticado para verificar su rol
    const user = await UserModel.findById(userId).populate("roles");
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar si el usuario tiene rol "admin" o es un médico
    const userRoles = user.roles.map((role: any) => role.name);
    const isAdmin = userRoles.includes("admin");
    const isMedico = await MedicoModel.exists({ _id: userId });

    if (!isAdmin && !isMedico) {
      throw new Error("Acceso denegado: solo médicos o administradores autorizados pueden agregar entradas al historial");
    }

    // Si el usuario es admin, usamos el medico del body; si es medico, usamos su propio ID
    const medicoId = isAdmin ? entry.medico : userId;

    const medicoExists = await MedicoModel.findById(medicoId);
    if (!medicoExists) {
      throw new Error("Médico no encontrado");
    }

    const newEntry = {
      ...entry,
      paciente: pacienteId,
      medico: medicoId,
    };
    return this.historialMedicoRepository.create(newEntry);
  }
}