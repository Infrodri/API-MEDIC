// src/services/HistorialMedicoService.ts
import { Types } from "mongoose";
import { MedicoModel } from "@models/Medicos";
import { UserModel } from "@models/Users";
import { IHistorialMedico, IHistorialMedicoRepository, IHistorialMedicoService } from "types/HistorialMedicoTypes";

export class HistorialMedicoService implements IHistorialMedicoService {
  private historialMedicoRepository: IHistorialMedicoRepository;

  constructor(historialMedicoRepository: IHistorialMedicoRepository) {
    this.historialMedicoRepository = historialMedicoRepository;
  }

  async getHistorialByPaciente(pacienteId: string): Promise<IHistorialMedico[]> {
    return this.historialMedicoRepository.findByPaciente(pacienteId);
  }

  async addHistorialEntry(
    pacienteId: string,
    entry: Omit<IHistorialMedico, "_id" | "paciente" | "createdAt" | "updatedAt">,
    userId: string
  ): Promise<IHistorialMedico> {
    const user = await UserModel.findById(userId).populate("roles").lean();
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const userRoles = user.roles?.map((role: any) => role.name) || [];
    const isAdmin = userRoles.includes("admin");

    const isMedico = await MedicoModel.exists({ usuario: userId });

    if (!isAdmin && !isMedico) {
      throw new Error("Acceso denegado: solo médicos o administradores autorizados pueden agregar entradas al historial");
    }

    // Si es admin, usa entry.medico; si no, usa userId
    const medicoId = isAdmin ? entry.medico : userId;

    const medicoExists = await MedicoModel.findById(medicoId);
    if (!medicoExists) {
      throw new Error("Médico no encontrado");
    }

    const newEntry: Partial<IHistorialMedico> = {
      ...entry,
      paciente: new Types.ObjectId(pacienteId), // Ya convertido a ObjectId
      medico: medicoId ? new Types.ObjectId(medicoId) : undefined, // Convertir medicoId a ObjectId
    };

    return this.historialMedicoRepository.create(newEntry, userId);
  }
}

export default new HistorialMedicoService(new (require("@repositories/HistorialMedicoRepository").HistorialMedicoRepository)());