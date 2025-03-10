// src/services/FichasMedicasService.ts
import { IFichasMedicasService, FichasMedicas, ConsultasMedicas, RecetaMedicamento, ExamenMedico } from "../types/FichaMedicaTypes";
import { MedicoModel } from "../models/Medicos";
import { UserModel } from "@models/Users";
import { IFichasMedicasRepository } from "@repositories/FichasMedicasRepositories";

export class FichasMedicasService implements IFichasMedicasService {
  private fichasMedicasRepository: IFichasMedicasRepository;

  constructor(fichasMedicasRepository: IFichasMedicasRepository) {
    this.fichasMedicasRepository = fichasMedicasRepository;
  }

  async getFichaByPaciente(pacienteId: string): Promise<FichasMedicas | null> {
    return this.fichasMedicasRepository.findByPaciente(pacienteId);
  }

  async addSection(pacienteId: string, section: string, data: any, userId: string): Promise<any> {
    const user = await UserModel.findById(userId).populate("roles");
    if (!user) throw new Error("Usuario no encontrado");

    const userRoles = user.roles.map((role: any) => role.name);
    const isAdmin = userRoles.includes("admin");
    const isMedico = await MedicoModel.exists({ _id: userId });

    if (!isAdmin && !isMedico) {
      throw new Error("Acceso denegado: solo médicos o administradores autorizados");
    }

    return this.fichasMedicasRepository.addSection(pacienteId, section, data, userId);
  }

  async getSection(pacienteId: string, section: string): Promise<any> {
    return this.fichasMedicasRepository.getSection(pacienteId, section);
  }

  async createConsulta(pacienteId: string, data: Partial<ConsultasMedicas>, userId: string): Promise<ConsultasMedicas> {
    const user = await UserModel.findById(userId).populate("roles");
    if (!user) throw new Error("Usuario no encontrado");

    const userRoles = user.roles.map((role: any) => role.name);
    const isAdmin = userRoles.includes("admin");
    const isMedico = await MedicoModel.exists({ _id: userId });

    if (!isAdmin && !isMedico) {
      throw new Error("Acceso denegado: solo médicos o administradores autorizados");
    }

    return this.fichasMedicasRepository.createConsulta(pacienteId, data, userId);
  }

  async addReceta(consultaId: string, data: Partial<RecetaMedicamento>, userId: string): Promise<RecetaMedicamento> {
    const user = await UserModel.findById(userId).populate("roles");
    if (!user) throw new Error("Usuario no encontrado");

    const userRoles = user.roles.map((role: any) => role.name);
    const isAdmin = userRoles.includes("admin");
    const isMedico = await MedicoModel.exists({ _id: userId });

    if (!isAdmin && !isMedico) {
      throw new Error("Acceso denegado: solo médicos o administradores autorizados");
    }

    return this.fichasMedicasRepository.addReceta(consultaId, data, userId);
  }

  async addExamen(consultaId: string, data: Partial<ExamenMedico>, userId: string): Promise<ExamenMedico> {
    const user = await UserModel.findById(userId).populate("roles");
    if (!user) throw new Error("Usuario no encontrado");

    const userRoles = user.roles.map((role: any) => role.name);
    const isAdmin = userRoles.includes("admin");
    const isMedico = await MedicoModel.exists({ _id: userId });

    if (!isAdmin && !isMedico) {
      throw new Error("Acceso denegado: solo médicos o administradores autorizados");
    }

    return this.fichasMedicasRepository.addExamen(consultaId, data, userId);
  }

  async updateConsulta(consultaId: string, data: Partial<ConsultasMedicas>, userId: string): Promise<ConsultasMedicas> {
    const user = await UserModel.findById(userId).populate("roles");
    if (!user) throw new Error("Usuario no encontrado");

    const userRoles = user.roles.map((role: any) => role.name);
    const isAdmin = userRoles.includes("admin");
    const isMedico = await MedicoModel.exists({ _id: userId });

    if (!isAdmin && !isMedico) {
      throw new Error("Acceso denegado: solo médicos o administradores autorizados");
    }

    return this.fichasMedicasRepository.updateConsulta(consultaId, data, userId);
  }

  async getConsultaPrintable(consultaId: string): Promise<any> {
    return this.fichasMedicasRepository.getConsultaPrintable(consultaId);
  }
}