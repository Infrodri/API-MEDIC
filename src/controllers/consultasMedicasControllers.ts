// src/controllers/consultasMedicasControllers.ts
import { ConsultasMedicasRepository } from "@repositories/ConsultasMedicasRepositories";
import { ConsultasMedicasService } from "@services/ConsultasMedicasService";
import { Request, Response } from "express";
import { IConsultasMedicasRepository, IConsultasMedicasService, ConsultasMedicas } from "types/ConsultasMedicasTypes";

const consultasMedicasRepository: IConsultasMedicasRepository = new ConsultasMedicasRepository();
const consultasMedicasService: IConsultasMedicasService = new ConsultasMedicasService(consultasMedicasRepository);

// Endpoints existentes (sin cambios)
export const createConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const newConsulta: Omit<ConsultasMedicas, keyof Document> = req.body;
    const { consulta, message } = await consultasMedicasService.createConsultasMedicas(newConsulta);
    res.status(201).json({ consulta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear consulta médica", details: error });
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
    res.status(500).json({ error: "Error al obtener consultas médicas", details: error });
  }
};

export const findConsultasMedicasById = async (req: Request, res: Response) => {
  try {
    const consulta = await consultasMedicasService.findConsultasMedicasById(req.params.id);
    if (!consulta) return res.status(404).json({ message: "Consulta médica no encontrada" });
    res.json({ consulta, message: "Consulta médica encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener consulta médica", details: error });
  }
};

export const findConsultasMedicasByPaciente = async (req: Request, res: Response) => {
  try {
    const consultas = await consultasMedicasService.findConsultasMedicasByPaciente(req.params.pacienteId);
    if (consultas.length === 0) return res.status(404).json({ message: "No hay consultas para este paciente" });
    res.json({ consultas, message: "Consultas médicas del paciente obtenidas con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener consultas del paciente", details: error });
  }
};

export const updateConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const { consulta, message } = await consultasMedicasService.updateConsultasMedicas(req.params.id, req.body);
    if (!consulta) return res.status(404).json({ message: "Consulta médica no encontrada" });
    res.json({ consulta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar consulta médica", details: error });
  }
};

export const deleteConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await consultasMedicasService.deleteConsultasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Consulta médica no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar consulta médica", details: error });
  }
};

export const softDeleteConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await consultasMedicasService.softDeleteConsultasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Consulta médica no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar consulta médica", details: error });
  }
};

export const concludeConsulta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { consulta, message } = await consultasMedicasService.concludeConsulta(id);
    res.json({ consulta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al concluir consulta", details: error });
  }
};

export const deriveConsulta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { medicoId } = req.body;
    const { consulta, message } = await consultasMedicasService.deriveConsultaMedica(id, medicoId);
    res.json({ consulta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al derivar consulta", details: error });
  }
};

export const reassignConsulta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { medicoId } = req.body;
    const { consulta, message } = await consultasMedicasService.reassignConsultaMedica(id, medicoId);
    res.json({ consulta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al reasignar consulta", details: error });
  }
};

// Nuevos endpoints para citas
export const programarCita = async (req: Request, res: Response) => {
  try {
    const newCita: Omit<ConsultasMedicas, keyof Document> = req.body;
    const { consulta, message } = await consultasMedicasService.createConsultasMedicas(newCita);
    res.status(201).json({ consulta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al programar cita", details: error });
  }
};

export const actualizarCita = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { consulta, message } = await consultasMedicasService.updateConsultasMedicas(id, req.body);
    if (!consulta) return res.status(404).json({ message: "Cita no encontrada" });
    res.json({ consulta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al actualizar cita", details: error });
  }
};

export const cancelarCita = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { success, message } = await consultasMedicasService.softDeleteConsultasMedicas(id);
    if (!success) return res.status(404).json({ message: "Cita no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al cancelar cita", details: error });
  }
};

// Nuevo endpoint para listar citas programadas
export const listarCitasProgramadas = async (req: Request, res: Response) => {
  try {
    const citas = await consultasMedicasService.findCitasProgramadas();
    if (citas.length === 0) return res.status(404).json({ message: "No hay citas programadas encontradas" });
    res.json({ citas, message: "Lista de citas programadas obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al listar citas programadas", details: error });
  }
};