// src/controllers/medicosControllers.ts
import { MedicoRepository } from "@repositories/MedicoRepositories";
import { MedicoService } from "@services/MedicoService";
import { Request, Response } from "express";
import { IMedicoRepository, IMedicoService, Medico } from "types/MedicoTypes";

const medicoRepository: IMedicoRepository = new MedicoRepository();
const medicoService: IMedicoService = new MedicoService(medicoRepository);

// Controladores existentes (sin cambios)
export const findMedicos = async (req: Request, res: Response) => {
  try {
    const medicos = await medicoService.findMedicos();
    const basicInfoList = medicos.map((medico) => medico.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay médicos encontrados." });

    res.json({ medicos: basicInfoList, message: "Lista de médicos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener médicos", details: error });
  }
};

export const findMedicoById = async (req: Request, res: Response) => {
  try {
    const medico = await medicoService.findMedicoById(req.params.id);
    if (!medico) return res.status(404).json({ message: "Médico no encontrado" });

    res.json({ medico, message: "Médico encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener médico", details: error });
  }
};

export const createMedico = async (req: Request, res: Response) => {
  try {
    const newMedico: Omit<Medico, keyof Document> = req.body;
    const { medico, message } = await medicoService.createMedico(newMedico);

    res.status(201).json({ medico, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear médico", details: error });
  }
};

export const updateMedico = async (req: Request, res: Response) => {
  try {
    const { medico, message } = await medicoService.updateMedico(req.params.id, req.body);
    if (!medico) return res.status(404).json({ message: "Médico no encontrado" });

    res.json({ medico, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar médico", details: error });
  }
};

export const softDeleteMedico = async (req: Request, res: Response) => {
  try {
    const { success, message } = await medicoService.softDeleteMedico(req.params.id);
    if (!success) return res.status(404).json({ message: "Médico no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar médico", details: error });
  }
};

export const deleteMedico = async (req: Request, res: Response) => {
  try {
    const { success, message } = await medicoService.deleteMedico(req.params.id);
    if (!success) return res.status(404).json({ message: "Médico no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar médico físicamente", details: error });
  }
};

// Nuevos controladores
export const getDoctorsBySpecialty = async (req: Request, res: Response) => {
  try {
    const specialtyCounts = await medicoService.getDoctorsBySpecialty();
    res.json({ data: specialtyCounts, message: "Médicos por especialidad obtenidos con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener médicos por especialidad", details: error });
  }
};
export const getActiveDoctorsToday = async (req: Request, res: Response) => {
  try {
    const count = await medicoService.getActiveDoctorsToday();
    res.json({ data: count, message: "Médicos activos hoy obtenidos con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener médicos activos hoy", details: error });
  }
};

export const getTotalDoctors = async (req: Request, res: Response) => {
  try {
    const count = await medicoService.getTotalDoctors();
    res.json({ data: count, message: "Total de médicos obtenido con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener total de médicos", details: error });
  }
};

// Nuevos controladores
export const getDoctorsBySpecialtyId = async (req: Request, res: Response) => {
  try {
    const especialidadId = req.params.especialidadId;
    const medicos = await medicoService.getDoctorsBySpecialtyId(especialidadId);
    if (medicos.length === 0) return res.status(404).json({ message: "No hay médicos con esta especialidad." });

    const basicInfoList = medicos.map((medico) => medico.getBasicInfo());
    res.json({ medicos: basicInfoList, message: "Médicos por especialidad obtenidos con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener médicos por especialidad", details: error });
  }
};

export const getDoctorsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const medicos = await medicoService.getDoctorsByUserId(userId);
    if (medicos.length === 0) return res.status(404).json({ message: "No hay médicos asociados a este usuario." });

    const basicInfoList = medicos.map((medico) => medico.getBasicInfo());
    res.json({ medicos: basicInfoList, message: "Médicos por usuario obtenidos con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener médicos por usuario", details: error });
  }
};

export const getDoctorsWithMultipleSpecialties = async (req: Request, res: Response) => {
  try {
    const medicos = await medicoService.getDoctorsWithMultipleSpecialties();
    if (medicos.length === 0) return res.status(404).json({ message: "No hay médicos con múltiples especialidades." });

    const basicInfoList = medicos.map((medico) => medico.getBasicInfo());
    res.json({ medicos: basicInfoList, message: "Médicos con múltiples especialidades obtenidos con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener médicos con múltiples especialidades", details: error });
  }
};