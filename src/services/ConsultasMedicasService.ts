// src/services/ConsultasMedicasService.ts
import { PacienteModel } from "@models/Pacientes";
import { Query } from "types/RepositoryTypes";
import { IConsultasMedicasRepository, IConsultasMedicasService, ConsultasMedicas } from "types/ConsultasMedicasTypes";
import { ConsultasMedicasRepository } from "@repositories/ConsultasMedicasRepositories";

export class ConsultasMedicasService implements IConsultasMedicasService {
  private consultasMedicasRepository: IConsultasMedicasRepository;

  constructor(consultasMedicasRepository: IConsultasMedicasRepository) {
    this.consultasMedicasRepository = consultasMedicasRepository;
  }

  async createConsultasMedicas(consultaData: Omit<ConsultasMedicas, keyof Document>): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const newConsulta = await this.consultasMedicasRepository.create({
      ...consultaData,
      estado: "Activo",
      estadoConsulta: "Pendiente",
    });
    return { consulta: newConsulta, message: "Consulta médica registrada con éxito" };
  }

  async findConsultasMedicas(query?: Query): Promise<ConsultasMedicas[]> {
    return this.consultasMedicasRepository.findActive(query);
  }

  async findConsultasMedicasById(id: string): Promise<ConsultasMedicas | null> {
    return this.consultasMedicasRepository.findById(id);
  }

  async findConsultasMedicasByPaciente(pacienteId: string): Promise<ConsultasMedicas[]> {
    return this.consultasMedicasRepository.findActive({ paciente: pacienteId });
  }

  async updateConsultasMedicas(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas | null; message: string }> {
    const updatedConsulta = await this.consultasMedicasRepository.update(id, consulta);
    if (!updatedConsulta) {
      return { consulta: null, message: "Consulta médica no encontrada" };
    }
    return { consulta: updatedConsulta, message: "Consulta médica actualizada con éxito" };
  }

  async deleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.consultasMedicasRepository.delete(id);
    return { success: deleted, message: deleted ? "Consulta médica eliminada físicamente" : "Consulta médica no encontrada" };
  }

  async softDeleteConsultasMedicas(id: string): Promise<{ success: boolean; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) {
      return { success: false, message: "Consulta médica no encontrada" };
    }
    consulta.estado = "Inactivo";
    await this.consultasMedicasRepository.update(id, consulta);
    return { success: true, message: "Consulta médica cambiada a estado Inactivo" };
  }

  async concludeConsulta(id: string): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    consulta.estadoConsulta = "Concluida";
    await this.consultasMedicasRepository.update(id, consulta);

    const paciente = await PacienteModel.findById(consulta.paciente);
    if (paciente) {
      paciente.estadoAtencion = "Atendido";
      await paciente.save();
    }

    return { consulta, message: "Consulta concluida con éxito" };
  }

  async deriveConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    consulta.estadoConsulta = "Derivada";
    consulta.medicoDerivado = medicoId as any;
    await this.consultasMedicasRepository.update(id, consulta);

    const paciente = await PacienteModel.findById(consulta.paciente);
    if (paciente) {
      paciente.estadoAtencion = "Derivado";
      await paciente.save();
    }

    return { consulta, message: "Consulta derivada con éxito" };
  }

  async reassignConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    consulta.medico = medicoId as any;
    consulta.estadoConsulta = "Pendiente";
    consulta.medicoDerivado = undefined;
    await this.consultasMedicasRepository.update(id, consulta);

    const paciente = await PacienteModel.findById(consulta.paciente);
    if (paciente) {
      paciente.estadoAtencion = "Pendiente";
      await paciente.save();
    }

    return { consulta, message: "Consulta reasignada con éxito" };
  }
}