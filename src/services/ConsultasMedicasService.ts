// src/services/ConsultasMedicasService.ts
import { PacienteModel } from "@models/Pacientes";
import { MedicoModel } from "@models/Medicos";
import { RecetasMedicamentosModel } from "@models/RecetasMedicamentos";
import { PacienteExamenModel } from "@models/PacienteExamenes";
import { Query } from "types/RepositoryTypes";
import { IConsultasMedicasRepository, IConsultasMedicasService, ConsultasMedicas } from "types/ConsultasMedicasTypes";
import { RecetasMedicamentos } from "types/RecetasMedicamentosTypes";
import { PacienteExamen } from "types/PacienteExamenesTypes";
import { Types } from "mongoose";

export class ConsultasMedicasService implements IConsultasMedicasService {
  private consultasMedicasRepository: IConsultasMedicasRepository;

  constructor(consultasMedicasRepository: IConsultasMedicasRepository) {
    this.consultasMedicasRepository = consultasMedicasRepository;
  }

  async createConsultasMedicas(consultaData: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const { paciente, medico, fecha, duracion } = consultaData;

    const pacienteExists = await PacienteModel.findById(paciente);
    const medicoExists = await MedicoModel.findById(medico);
    if (!pacienteExists || !medicoExists) {
      throw new Error("Paciente o médico no encontrado");
    }

    const isAvailable = await this.consultasMedicasRepository.checkAvailability(medico!.toString(), fecha!, duracion || 30);
    if (!isAvailable) {
      throw new Error("El médico no está disponible en ese horario");
    }

    const newConsulta = await this.consultasMedicasRepository.create({
      ...consultaData,
      estado: "Activo",
      estadoConsulta: "Pendiente",
    } as ConsultasMedicas);
    return { consulta: newConsulta, message: "Consulta médica registrada con éxito" };
  }

  async findConsultasMedicas(query?: Query): Promise<ConsultasMedicas[]> {
    return this.consultasMedicasRepository.findActive(query);
  }

  async findCitasProgramadas(): Promise<ConsultasMedicas[]> {
    return this.consultasMedicasRepository.findActive({ estadoConsulta: "Pendiente" });
  }

  async findConsultasMedicasById(id: string): Promise<ConsultasMedicas | null> {
    return this.consultasMedicasRepository.findById(id);
  }

  async findConsultasMedicasByPaciente(pacienteId: string): Promise<ConsultasMedicas[]> {
    return this.consultasMedicasRepository.findActive({ paciente: pacienteId });
  }

  async updateConsultasMedicas(
    id: string, 
    consulta: Partial<ConsultasMedicas>
  ): Promise<{ consulta: ConsultasMedicas | null; message: string }> {
    
    const existingConsulta = await this.consultasMedicasRepository.findById(id);
    if (!existingConsulta) {
      return { consulta: null, message: "Consulta médica no encontrada" };
    }
  
    if (consulta.fecha || consulta.medico || consulta.duracion) {
      const nuevaFecha = consulta.fecha || existingConsulta.fecha;
      
      let nuevoMedico: string;
      
      if (consulta.medico) {
        nuevoMedico = consulta.medico.toString();
      } else if (existingConsulta.medico instanceof Types.ObjectId) {
        nuevoMedico = existingConsulta.medico.toString();
      } else if (typeof existingConsulta.medico === "object" && existingConsulta.medico._id) {
        nuevoMedico = existingConsulta.medico._id.toString();
      } else {
        throw new Error("No se pudo determinar el ID del médico");
      }
  
      const nuevaDuracion = consulta.duracion || existingConsulta.duracion;
  
      const isAvailable = await this.consultasMedicasRepository.checkAvailability(nuevoMedico, nuevaFecha, nuevaDuracion);
      if (!isAvailable) {
        throw new Error("El médico no está disponible en el nuevo horario");
      }
    }
  
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
    await this.consultasMedicasRepository.update(id, { estadoConsulta: "Cancelada" });
    return { success: true, message: "Consulta médica cancelada con éxito" };
  }

  async concludeConsulta(id: string): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    consulta.estadoConsulta = "Concluida";
    const updatedConsulta = await this.consultasMedicasRepository.update(id, consulta);

    const paciente = await PacienteModel.findById(consulta.paciente);
    if (paciente) {
      paciente.estadoAtencion = "Atendido";
      await paciente.save();
    }

    return { consulta: updatedConsulta!, message: "Consulta concluida con éxito" };
  }

  async deriveConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    consulta.estadoConsulta = "Derivada";
    consulta.medicoDerivado = medicoId as any;
    const updatedConsulta = await this.consultasMedicasRepository.update(id, consulta);

    const paciente = await PacienteModel.findById(consulta.paciente);
    if (paciente) {
      paciente.estadoAtencion = "Derivado";
      await paciente.save();
    }

    return { consulta: updatedConsulta!, message: "Consulta derivada con éxito" };
  }

  async reassignConsultaMedica(id: string, medicoId: string): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    consulta.medico = medicoId as any;
    consulta.estadoConsulta = "Pendiente";
    consulta.medicoDerivado = undefined;
    const updatedConsulta = await this.consultasMedicasRepository.update(id, consulta);

    const paciente = await PacienteModel.findById(consulta.paciente);
    if (paciente) {
      paciente.estadoAtencion = "Pendiente";
      await paciente.save();
    }

    return { consulta: updatedConsulta!, message: "Consulta reasignada con éxito" };
  }

  async addRecetaToConsulta(
    id: string, 
    recetaData: Partial<RecetasMedicamentos>
  ): Promise<{ consulta: ConsultasMedicas; message: string }> {
  
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) {
      throw new Error("Consulta no encontrada");
    }
  
    if (!consulta.medico) {
      throw new Error("La consulta no tiene un médico asignado");
    }
  
    const nuevaReceta = new RecetasMedicamentosModel({
      ...recetaData,
      consulta: id,
      medico: consulta.medico,
      estado: "Activo",
    });
  
    await nuevaReceta.save();
  
    const updatedConsulta = await this.consultasMedicasRepository.update(id, {
      ...consulta.toObject(),
      recetas: [...(consulta.recetas || []), nuevaReceta._id]
    });
  
    if (!updatedConsulta) {
      throw new Error("Error al actualizar la consulta con la nueva receta");
    }
  
    return { consulta: updatedConsulta, message: "Receta añadida a la consulta con éxito" };
  }
  
  
  
  async addExamenToConsulta(
    id: string, 
    examenData: Partial<PacienteExamen>
  ): Promise<{ consulta: ConsultasMedicas; message: string }> {
  
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) {
      throw new Error("Consulta no encontrada");
    }
  
    if (!consulta.paciente) {
      throw new Error("La consulta no tiene un paciente asignado");
    }
  
    const nuevoExamen = new PacienteExamenModel({
      ...examenData,
      paciente: consulta.paciente,
      estado: "Activo",
    });
  
    await nuevoExamen.save();
  
    const updatedConsulta = await this.consultasMedicasRepository.update(id, {
      ...consulta.toObject(),
      examenes: [...(consulta.examenes || []), nuevoExamen._id]
    });
  
    if (!updatedConsulta) {
      throw new Error("Error al actualizar la consulta con el nuevo examen");
    }
  
    return { consulta: updatedConsulta, message: "Examen añadido a la consulta con éxito" };
  }
  
  

  async generateReporte(id: string, tipo: "receta" | "examen" | "ampliacion"): Promise<{ reporte: any; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    switch (tipo) {
      case "receta":
        const recetas = await RecetasMedicamentosModel.find({ _id: { $in: consulta.recetas } }).populate("medicamento");
        return { reporte: recetas, message: "Reporte de recetas generado con éxito" };
      case "examen":
        const examenes = await PacienteExamenModel.find({ _id: { $in: consulta.examenes } }).populate("examenMedico");
        return { reporte: examenes, message: "Reporte de exámenes generado con éxito" };
      case "ampliacion":
        return {
          reporte: {
            motivo: consulta.motivo,
            sintomas: consulta.sintomas,
            diagnostico: consulta.diagnostico,
            tratamiento: consulta.tratamiento,
            observaciones: consulta.observaciones,
            recomendacionDescanso: consulta.recomendacionDescanso,
          },
          message: "Reporte de ampliación generado con éxito",
        };
      default:
        throw new Error("Tipo de reporte no válido");
    }
  }
}