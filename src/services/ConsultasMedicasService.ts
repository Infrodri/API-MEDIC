import { PacienteModel } from "@models/Pacientes";
import { MedicoModel } from "@models/Medicos";
import { EspecialidadesModel } from "@models/Especialidades";
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
    const { paciente, medico, fecha, duracion, especialidad } = consultaData;

    const pacienteExists = await PacienteModel.findById(paciente);
    const medicoExists = await MedicoModel.findById(medico).populate("especialidades");
    const especialidadExists = await EspecialidadesModel.findById(especialidad);

    if (!pacienteExists) throw new Error(`Paciente con ID ${paciente} no encontrado`);
    if (!medicoExists) throw new Error(`Médico con ID ${medico} no encontrado`);
    if (!especialidadExists) throw new Error(`Especialidad con ID ${especialidad} no encontrada`);

    const medicoEspecialidades = medicoExists.especialidades.map((esp: any) => esp._id.toString());
    if (!medicoEspecialidades.includes(especialidad!.toString())) {
      throw new Error("El médico no pertenece a la especialidad requerida para esta consulta");
    }

    const start = new Date(fecha!);
    const end = new Date(start.getTime() + (duracion || 30) * 60000);
    const isAvailable = await this.consultasMedicasRepository.checkAvailability(medico!.toString(), fecha!, duracion || 30);
    if (!isAvailable) {
      const conflictingCitas = await this.consultasMedicasRepository.find({
        medico: medico!.toString(),
        estadoConsulta: { $in: ["Pendiente", "Concluida"] },
        fecha: { $lt: end },
        $expr: { $gt: [{ $add: ["$fecha", { $multiply: ["$duracion", 60000] }] }, start] },
      });
      throw new Error(`El médico no está disponible en ese horario. Conflictos con consultas: ${conflictingCitas.map(c => c._id).join(", ")}`);
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

    if (consulta.medico || consulta.especialidad || consulta.fecha || consulta.duracion) {
      const medicoId = consulta.medico || existingConsulta.medico;
      const especialidadId = consulta.especialidad || existingConsulta.especialidad;
      const nuevaFecha = consulta.fecha || existingConsulta.fecha;
      const nuevaDuracion = consulta.duracion || existingConsulta.duracion;

      const medicoExists = await MedicoModel.findById(medicoId).populate("especialidades");
      if (!medicoExists) throw new Error("Médico no encontrado");

      const medicoEspecialidades = medicoExists.especialidades.map((esp: any) => esp._id.toString());
      if (!medicoEspecialidades.includes(especialidadId!.toString())) {
        throw new Error("El médico no pertenece a la especialidad requerida para esta consulta");
      }

      const isAvailable = await this.consultasMedicasRepository.checkAvailability(medicoId!.toString(), nuevaFecha, nuevaDuracion);
      if (!isAvailable) throw new Error("El médico no está disponible en el nuevo horario");
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
    if (!consulta) return { success: false, message: "Consulta médica no encontrada" };
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

  async deriveConsultaMedica(
    id: string,
    medicoId: string,
    nuevaEspecialidadId: string,
    nuevaFecha?: string
  ): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const originalConsulta = await this.consultasMedicasRepository.findById(id);
    if (!originalConsulta) throw new Error(`Consulta con ID ${id} no encontrada`);

    if (originalConsulta.estadoConsulta !== "Concluida" && originalConsulta.estadoConsulta !== "Pendiente") {
      throw new Error("Solo se pueden derivar consultas Pendientes o Concluidas");
    }

    if (!nuevaEspecialidadId) throw new Error("Debe proporcionarse una nueva especialidad para derivar la consulta");

    const medicoExists = await MedicoModel.findById(medicoId).populate("especialidades");
    const especialidadExists = await EspecialidadesModel.findById(nuevaEspecialidadId);
    if (!medicoExists) throw new Error(`Médico con ID ${medicoId} no encontrado`);
    if (!especialidadExists) throw new Error(`Especialidad con ID ${nuevaEspecialidadId} no encontrada`);

    const medicoEspecialidades = medicoExists.especialidades.map((esp: any) => esp._id.toString());
    if (!medicoEspecialidades.includes(nuevaEspecialidadId)) {
      throw new Error("El médico derivado no pertenece a la nueva especialidad requerida");
    }

    const fechaDerivada = nuevaFecha ? new Date(nuevaFecha) : originalConsulta.fecha;
    const isAvailable = await this.consultasMedicasRepository.checkAvailability(medicoId, fechaDerivada, originalConsulta.duracion || 30);
    if (!isAvailable) throw new Error("El médico derivado no está disponible en el horario seleccionado");

    const newConsultaData = {
      ...originalConsulta.toObject(),
      _id: undefined,
      medico: medicoId,
      especialidad: nuevaEspecialidadId,
      fecha: fechaDerivada,
      estado: "Activo",
      estadoConsulta: "Pendiente",
      medicoDerivado: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      observaciones: `${originalConsulta.observaciones || ""} - Derivado desde consulta ${id} a ${especialidadExists.nombre}`,
    };

    const newConsulta = await this.consultasMedicasRepository.create(newConsultaData as ConsultasMedicas);

    await this.consultasMedicasRepository.update(id, {
      estadoConsulta: "Derivada",
      medicoDerivado: medicoId,
      updatedAt: new Date(),
    });

    const paciente = await PacienteModel.findById(originalConsulta.paciente);
    if (paciente) {
      paciente.estadoAtencion = "Derivado";
      await paciente.save();
    }

    return { consulta: newConsulta, message: `Consulta derivada con éxito a ${especialidadExists.nombre}` };
  }

  async reassignConsultaMedica(
    id: string,
    medicoId: string,
    nuevaFecha?: string,
    nuevaPrioridad?: "Normal" | "Alta" | "Urgente"
  ): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const originalConsulta = await this.consultasMedicasRepository.findById(id);
    if (!originalConsulta) throw new Error(`Consulta con ID ${id} no encontrada`);

    const especialidadId = originalConsulta.especialidad?._id?.toString() || originalConsulta.especialidad?.toString();
    if (!especialidadId) throw new Error("La consulta no tiene una especialidad definida");

    const medicoExists = await MedicoModel.findById(medicoId).populate("especialidades");
    if (!medicoExists) throw new Error(`Médico con ID ${medicoId} no encontrado`);

    const medicoEspecialidades = medicoExists.especialidades.map((esp: any) => esp._id.toString());
    if (!medicoEspecialidades.includes(especialidadId)) {
      throw new Error("El médico reasignado no pertenece a la especialidad de la consulta");
    }

    const reassignFecha = nuevaFecha ? new Date(nuevaFecha) : new Date(originalConsulta.fecha.getTime() + 24 * 60 * 60 * 1000);
    const isAvailable = await this.consultasMedicasRepository.checkAvailability(medicoId, reassignFecha, originalConsulta.duracion || 30);
    if (!isAvailable) throw new Error("El médico no está disponible en el nuevo horario");

    const newConsultaData = {
      ...originalConsulta.toObject(),
      _id: undefined,
      medico: medicoId,
      fecha: reassignFecha,
      prioridad: nuevaPrioridad || originalConsulta.prioridad,
      estado: "Activo",
      estadoConsulta: "Pendiente",
      medicoDerivado: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      observaciones: `${originalConsulta.observaciones || ""} - Reasignada desde consulta ${id}`,
    };

    const newConsulta = await this.consultasMedicasRepository.create(newConsultaData as ConsultasMedicas);

    await this.consultasMedicasRepository.update(id, {
      estadoConsulta: "Concluida",
      updatedAt: new Date(),
    });

    const paciente = await PacienteModel.findById(originalConsulta.paciente);
    if (paciente) {
      paciente.estadoAtencion = "Pendiente";
      await paciente.save();
    }

    return { consulta: newConsulta, message: "Consulta reasignada con éxito a un nuevo registro" };
  }

  async addRecetaToConsulta(
    id: string,
    recetaData: Partial<RecetasMedicamentos>
  ): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    if (!consulta.medico) throw new Error("La consulta no tiene un médico asignado");

    const nuevaReceta = new RecetasMedicamentosModel({
      ...recetaData,
      consulta: id,
      medico: consulta.medico,
      estado: "Activo",
    });

    await nuevaReceta.save();

    const updatedConsulta = await this.consultasMedicasRepository.update(id, {
      ...consulta.toObject(),
      recetas: [...(consulta.recetas || []), nuevaReceta._id],
    });

    if (!updatedConsulta) throw new Error("Error al actualizar la consulta con la nueva receta");

    return { consulta: updatedConsulta, message: "Receta añadida a la consulta con éxito" };
  }

  async addExamenToConsulta(
    id: string,
    examenData: Partial<PacienteExamen>
  ): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const consulta = await this.consultasMedicasRepository.findById(id);
    if (!consulta) throw new Error("Consulta no encontrada");

    if (!consulta.paciente) throw new Error("La consulta no tiene un paciente asignado");

    const nuevoExamen = new PacienteExamenModel({
      ...examenData,
      paciente: consulta.paciente,
      estado: "Activo",
    });

    await nuevoExamen.save();

    const updatedConsulta = await this.consultasMedicasRepository.update(id, {
      ...consulta.toObject(),
      examenes: [...(consulta.examenes || []), nuevoExamen._id],
    });

    if (!updatedConsulta) throw new Error("Error al actualizar la consulta con el nuevo examen");

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

  async countConsultasByEspecialidad(especialidadId: string): Promise<number> {
    return this.consultasMedicasRepository.countByEspecialidad(especialidadId);
  }

  async countConsultasByMedico(medicoId: string): Promise<number> {
    return this.consultasMedicasRepository.countByMedico(medicoId);
  }

  async countConsultasByPaciente(pacienteId: string): Promise<number> {
    return this.consultasMedicasRepository.countByPaciente(pacienteId);
  }

  async getAvailableSlots(medicoId: string, date: string): Promise<string[]> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const citas = await this.consultasMedicasRepository.find({
      medico: medicoId,
      fecha: { $gte: startOfDay, $lte: endOfDay },
      estadoConsulta: { $in: ["Pendiente", "Concluida"] },
    });

    const slots = [];
    let currentTime = new Date(startOfDay);
    currentTime.setUTCHours(8, 0, 0, 0); // Horario laboral desde 8:00

    while (currentTime < endOfDay && currentTime.getUTCHours() < 18) { // Hasta 18:00
      const slotEnd = new Date(currentTime.getTime() + 30 * 60000);
      const isOccupied = citas.some(cita => {
        const citaStart = new Date(cita.fecha);
        const citaEnd = new Date(citaStart.getTime() + (cita.duracion || 30) * 60000);
        return currentTime < citaEnd && slotEnd > citaStart;
      });

      if (!isOccupied) {
        slots.push(currentTime.toISOString());
      }
      currentTime = slotEnd;
    }

    return slots;
  }
}