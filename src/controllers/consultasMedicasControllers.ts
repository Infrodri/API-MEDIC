import { ConsultasMedicasRepository } from "@repositories/ConsultasMedicasRepositories";
import { ConsultasMedicasService } from "@services/ConsultasMedicasService";
import { Request, Response } from "express";
import { IConsultasMedicasRepository, IConsultasMedicasService, ConsultasMedicas } from "types/ConsultasMedicasTypes";

const consultasMedicasRepository: IConsultasMedicasRepository = new ConsultasMedicasRepository();
const consultasMedicasService: IConsultasMedicasService = new ConsultasMedicasService(consultasMedicasRepository);

export const createConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const newConsulta: Partial<ConsultasMedicas> = req.body;
    const { consulta, message } = await consultasMedicasService.createConsultasMedicas(newConsulta);
    res.status(201).json({ consulta: consulta.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear consulta médica", details: error.message });
  }
};

export const findConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const consultas = await consultasMedicasService.findConsultasMedicas();
    const basicInfoList = consultas.map((consulta) => consulta.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay consultas médicas encontradas." });
    res.json({ consultas: basicInfoList, message: "Lista de consultas médicas obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener consultas médicas", details: error.message });
  }
};

export const findConsultasMedicasById = async (req: Request, res: Response) => {
  try {
    const consulta = await consultasMedicasService.findConsultasMedicasById(req.params.id);
    if (!consulta) return res.status(404).json({ message: "Consulta médica no encontrada" });
    res.json({ consulta: consulta.getBasicInfo(), message: "Consulta médica encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener consulta médica", details: error.message });
  }
};

export const findConsultasMedicasByPaciente = async (req: Request, res: Response) => {
  try {
    const consultas = await consultasMedicasService.findConsultasMedicasByPaciente(req.params.pacienteId);
    const basicInfoList = consultas.map((consulta) => consulta.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay consultas para este paciente" });
    res.json({ consultas: basicInfoList, message: "Consultas del paciente obtenidas con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener consultas del paciente", details: error.message });
  }
};

export const updateConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const { consulta, message } = await consultasMedicasService.updateConsultasMedicas(req.params.id, req.body);
    if (!consulta) return res.status(404).json({ message: "Consulta médica no encontrada" });
    res.json({ consulta: consulta.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar consulta médica", details: error.message });
  }
};

export const deleteConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await consultasMedicasService.deleteConsultasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Consulta médica no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar consulta médica", details: error.message });
  }
};

export const softDeleteConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await consultasMedicasService.softDeleteConsultasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Consulta médica no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al cancelar consulta médica", details: error.message });
  }
};

export const concludeConsulta = async (req: Request, res: Response) => {
  try {
    const { consulta, message } = await consultasMedicasService.concludeConsulta(req.params.id);
    res.json({ consulta: consulta.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al concluir consulta", details: error.message });
  }
};

export const deriveConsulta = async (req: Request, res: Response) => {
  try {
    const { medicoId, nuevaEspecialidadId, nuevaFecha } = req.body;
    const { consulta, message } = await consultasMedicasService.deriveConsultaMedica(
      req.params.id,
      medicoId,
      nuevaEspecialidadId,
      nuevaFecha
    );
    res.json({ consulta: consulta.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al derivar consulta", details: error.message });
  }
};

export const reassignConsulta = async (req: Request, res: Response) => {
  try {
    const { medicoId, nuevaFecha, nuevaPrioridad } = req.body;
    const { consulta, message } = await consultasMedicasService.reassignConsultaMedica(
      req.params.id,
      medicoId,
      nuevaFecha,
      nuevaPrioridad
    );
    res.json({ consulta: consulta.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al reasignar consulta", details: error.message });
  }
};

export const addRecetaToConsulta = async (req: Request, res: Response) => {
  try {
    const { consulta, message } = await consultasMedicasService.addRecetaToConsulta(req.params.id, req.body);
    res.status(201).json({ consulta: consulta.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al añadir receta a la consulta", details: error.message });
  }
};

export const addExamenToConsulta = async (req: Request, res: Response) => {
  try {
    const { consulta, message } = await consultasMedicasService.addExamenToConsulta(req.params.id, req.body);
    res.status(201).json({ consulta: consulta.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al añadir examen a la consulta", details: error.message });
  }
};

export const generateReporte = async (req: Request, res: Response) => {
  try {
    const { tipo } = req.query;
    const { reporte, message } = await consultasMedicasService.generateReporte(req.params.id, tipo as "receta" | "examen" | "ampliacion");
    res.json({ reporte, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al generar reporte", details: error.message });
  }
};

export const countConsultasByEspecialidad = async (req: Request, res: Response) => {
  try {
    const count = await consultasMedicasService.countConsultasByEspecialidad(req.params.especialidadId);
    res.json({ count, message: "Cantidad de consultas por especialidad obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al contar consultas por especialidad", details: error.message });
  }
};

export const countConsultasByMedico = async (req: Request, res: Response) => {
  try {
    const count = await consultasMedicasService.countConsultasByMedico(req.params.medicoId);
    res.json({ count, message: "Cantidad de consultas por médico obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al contar consultas por médico", details: error.message });
  }
};

export const countConsultasByPaciente = async (req: Request, res: Response) => {
  try {
    const count = await consultasMedicasService.countConsultasByPaciente(req.params.pacienteId);
    res.json({ count, message: "Cantidad de consultas por paciente obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al contar consultas por paciente", details: error.message });
  }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { medicoId, date } = req.query;
    const slots = await consultasMedicasService.getAvailableSlots(medicoId as string, date as string);
    res.json({ slots, message: "Horarios disponibles obtenidos con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener horarios disponibles", details: error.message });
  }
};