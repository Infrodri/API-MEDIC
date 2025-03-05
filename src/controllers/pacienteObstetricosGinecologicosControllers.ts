// src/controllers/pacienteObstetricosGinecologicosControllers.ts
import { PacienteObstetricoGinecologicoRepository } from "@repositories/PacienteObstetricosGinecologicosRepositories";
import { PacienteObstetricoGinecologicoService } from "@services/PacienteObstetricosGinecologicosService";
import { Request, Response } from "express";
import { IPacienteObstetricoGinecologicoRepository, IPacienteObstetricoGinecologicoService, PacienteObstetricoGinecologico } from "types/PacienteObstetricosGinecologicosTypes";

const pacienteObstetricoGinecologicoRepository: IPacienteObstetricoGinecologicoRepository = new PacienteObstetricoGinecologicoRepository();
const pacienteObstetricoGinecologicoService: IPacienteObstetricoGinecologicoService = new PacienteObstetricoGinecologicoService(pacienteObstetricoGinecologicoRepository);

export const createPacienteObstetricoGinecologico = async (req: Request, res: Response) => {
  try {
    const newPacienteObstetricoGinecologico: Omit<PacienteObstetricoGinecologico, keyof Document> = req.body;
    const { pacienteObstetricoGinecologico, message } = await pacienteObstetricoGinecologicoService.createPacienteObstetricoGinecologico(newPacienteObstetricoGinecologico);
    res.status(201).json({ pacienteObstetricoGinecologico, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear registro obstétrico/ginecológico del paciente", details: error });
  }
};

export const findPacienteObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const pacienteObstetricosGinecologicos = await pacienteObstetricoGinecologicoService.findPacienteObstetricosGinecologicos();
    const basicInfoList = pacienteObstetricosGinecologicos.map((registro) => registro.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay registros obstétricos/ginecológicos encontrados." });
    res.json({ pacienteObstetricosGinecologicos: basicInfoList, message: "Lista de registros obstétricos/ginecológicos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener registros obstétricos/ginecológicos", details: error });
  }
};

export const findPacienteObstetricoGinecologicoById = async (req: Request, res: Response) => {
  try {
    const pacienteObstetricoGinecologico = await pacienteObstetricoGinecologicoService.findPacienteObstetricoGinecologicoById(req.params.id);
    if (!pacienteObstetricoGinecologico) return res.status(404).json({ message: "Registro obstétrico/ginecológico no encontrado" });
    res.json({ pacienteObstetricoGinecologico, message: "Registro obstétrico/ginecológico encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener registro obstétrico/ginecológico", details: error });
  }
};

export const findPacienteObstetricosGinecologicosByPaciente = async (req: Request, res: Response) => {
  try {
    const pacienteObstetricosGinecologicos = await pacienteObstetricoGinecologicoService.findPacienteObstetricosGinecologicosByPaciente(req.params.pacienteId);
    const basicInfoList = pacienteObstetricosGinecologicos.map((registro) => registro.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay registros obstétricos/ginecológicos para este paciente" });
    res.json({ pacienteObstetricosGinecologicos: basicInfoList, message: "Registros obstétricos/ginecológicos del paciente obtenidos con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener registros obstétricos/ginecológicos por paciente", details: error });
  }
};

export const updatePacienteObstetricoGinecologico = async (req: Request, res: Response) => {
  try {
    const { pacienteObstetricoGinecologico, message } = await pacienteObstetricoGinecologicoService.updatePacienteObstetricoGinecologico(req.params.id, req.body);
    if (!pacienteObstetricoGinecologico) return res.status(404).json({ message: "Registro obstétrico/ginecológico no encontrado" });
    res.json({ pacienteObstetricoGinecologico, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar registro obstétrico/ginecológico", details: error });
  }
};

export const deletePacienteObstetricoGinecologico = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteObstetricoGinecologicoService.deletePacienteObstetricoGinecologico(req.params.id);
    if (!success) return res.status(404).json({ message: "Registro obstétrico/ginecológico no encontrado" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar registro obstétrico/ginecológico físicamente", details: error });
  }
};

export const softDeletePacienteObstetricoGinecologico = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteObstetricoGinecologicoService.softDeletePacienteObstetricoGinecologico(req.params.id);
    if (!success) return res.status(404).json({ message: "Registro obstétrico/ginecológico no encontrado" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar registro obstétrico/ginecológico", details: error });
  }
};