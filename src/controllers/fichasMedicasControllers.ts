// src/controllers/fichasMedicasControllers.ts
import { Request, Response } from "express";
import { FichasMedicasService } from "../services/FichasMedicasService";
import { FichasMedicasRepository } from "../repositories/FichasMedicasRepositories";
import { AntecedentesPersonales } from "../types/AntecedentesPersonalesTypes";
import { AntecedentesFamiliares } from "../types/AntecedentesFamiliaresTypes";
import { PacienteOperacion } from "../types/PacienteOperacionesTypes";
import { PacienteObstetricoGinecologico } from "../types/PacienteObstetricosGinecologicosTypes";
import { PacienteAdiccion } from "../types/PacienteAdiccionesTypes";
import { ExploracionFisica } from "../types/ExploracionFisicaTypes";
import { ExamenNeurologico } from "../types/ExamenNeurologicoTypes";
import { OrganosSentidos } from "../types/OrganosSentidosTypes";
import { ConsultasMedicas } from "../types/ConsultasMedicasTypes";

const fichasMedicasRepository = new FichasMedicasRepository();
const fichasMedicasService = new FichasMedicasService(fichasMedicasRepository);

// Nuevo controlador para listar fichas
export const listFichas = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const estado = req.query.estado as "Activo" | "Inactivo" | undefined;

    const { fichas, total } = await fichasMedicasService.listFichas(page, limit, estado);
    res.status(200).json({
      fichas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al listar las fichas médicas", details: error.message });
  }
};

export const getFichaByPaciente = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const ficha = await fichasMedicasService.getFichaByPaciente(pacienteId);
    if (!ficha) {
      return res.status(404).json({ message: "Ficha médica no encontrada" });
    }
    res.status(200).json(ficha);
  } catch (error: any) {
    if (error.code === "PATIENT_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno al obtener la ficha médica", details: error.message });
  }
};

export const createFicha = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.body;
    if (!pacienteId) {
      return res.status(400).json({ error: "El ID del paciente es requerido" });
    }
    const result = await fichasMedicasService.createFicha(pacienteId);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.code === "PATIENT_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    if (error.code === "FICHA_ALREADY_EXISTS") {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno al crear la ficha médica", details: error.message });
  }
};

export const updateFicha = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await fichasMedicasService.updateFicha(id, data);
    if (!result.ficha) {
      return res.status(404).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error: any) {
    if (error.code === "UPDATE_FAILED") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno al actualizar la ficha médica", details: error.message });
  }
};

export const softDeleteFicha = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await fichasMedicasService.softDeleteFicha(id);
    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al desactivar la ficha médica", details: error.message });
  }
};

export const addAntecedentesPersonales = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data: Partial<AntecedentesPersonales> = req.body;
    const result = await fichasMedicasService.addAntecedentesPersonales(pacienteId, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al añadir antecedentes personales", details: error.message });
  }
};

export const addAntecedentesFamiliares = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data: Partial<AntecedentesFamiliares> = req.body;
    const result = await fichasMedicasService.addAntecedentesFamiliares(pacienteId, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al añadir antecedentes familiares", details: error.message });
  }
};

export const addOperacionQuirurgica = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data: Partial<PacienteOperacion> = req.body;
    const result = await fichasMedicasService.addOperacionQuirurgica(pacienteId, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al añadir operación quirúrgica", details: error.message });
  }
};

export const addGinecologiaObstetrica = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data: Partial<PacienteObstetricoGinecologico> = req.body;
    const result = await fichasMedicasService.addGinecologiaObstetrica(pacienteId, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al añadir ginecología y obstetricia", details: error.message });
  }
};

export const addAdiccion = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data: Partial<PacienteAdiccion> = req.body;
    const result = await fichasMedicasService.addAdiccion(pacienteId, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al añadir adicción", details: error.message });
  }
};

export const addExploracionFisica = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data: Partial<ExploracionFisica> = req.body;
    const result = await fichasMedicasService.addExploracionFisica(pacienteId, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al añadir exploración física", details: error.message });
  }
};

export const addExamenNeurologico = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data: Partial<ExamenNeurologico> = req.body;
    const result = await fichasMedicasService.addExamenNeurologico(pacienteId, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al añadir examen neurológico", details: error.message });
  }
};

export const addOrganosSentidos = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data: Partial<OrganosSentidos> = req.body;
    const result = await fichasMedicasService.addOrganosSentidos(pacienteId, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Error interno al añadir órganos de los sentidos", details: error.message });
  }
};

export const addConsultaMedica = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const consulta: Partial<ConsultasMedicas> = req.body;
    const result = await fichasMedicasService.addConsultaMedica(id, consulta);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.code === "FICHA_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno al añadir consulta médica", details: error.message });
  }
};

export const generateReporte = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reporte = await fichasMedicasService.generateReporte(id);
    res.status(200).json(reporte);
  } catch (error: any) {
    if (error.code === "FICHA_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno al generar el reporte", details: error.message });
  }
};