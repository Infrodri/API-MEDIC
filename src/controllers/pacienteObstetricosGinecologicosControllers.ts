import { PacienteObstetricosGinecologicosRepository } from "@repositories/PacienteObstetricosGinecologicosRepositories";
import { PacienteObstetricosGinecologicosService } from "@services/PacienteObstetricosGinecologicosService";
import { Request, Response } from "express";
import { IPacienteObstetricosGinecologicosRepository, IPacienteObstetricosGinecologicosService, PacienteObstetricosGinecologicos } from "types/PacienteObstetricosGinecologicosTypes";

const pacienteObstetricosGinecologicosRepository: IPacienteObstetricosGinecologicosRepository = new PacienteObstetricosGinecologicosRepository();
const pacienteObstetricosGinecologicosService: IPacienteObstetricosGinecologicosService = new PacienteObstetricosGinecologicosService(pacienteObstetricosGinecologicosRepository);

export const findPacienteObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const pacientesOG = await pacienteObstetricosGinecologicosService.findPacienteObstetricosGinecologicos();
    const basicInfoList = pacientesOG.map((pacienteOG) => pacienteOG.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay relaciones paciente-obstétrico/ginecológico encontradas." });

    res.json({ pacientesOG: basicInfoList, message: "Lista de relaciones paciente-obstétrico/ginecológico obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relaciones paciente-obstétrico/ginecológico", details: error });
  }
};

export const findPacienteObstetricosGinecologicosById = async (req: Request, res: Response) => {
  try {
    const pacienteOG = await pacienteObstetricosGinecologicosService.findPacienteObstetricosGinecologicosById(req.params.id);
    if (!pacienteOG) return res.status(404).json({ message: "Relación paciente-obstétrico/ginecológico no encontrada" });

    res.json({ pacienteOG, message: "Relación paciente-obstétrico/ginecológico encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relación paciente-obstétrico/ginecológico", details: error });
  }
};

export const createPacienteObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const newPacienteOG: Omit<PacienteObstetricosGinecologicos, keyof Document> = req.body;
    const { pacienteOG, message } = await pacienteObstetricosGinecologicosService.createPacienteObstetricosGinecologicos(newPacienteOG);

    res.status(201).json({ pacienteOG, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear relación paciente-obstétrico/ginecológico", details: error });
  }
};

export const updatePacienteObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const { pacienteOG, message } = await pacienteObstetricosGinecologicosService.updatePacienteObstetricosGinecologicos(req.params.id, req.body);
    if (!pacienteOG) return res.status(404).json({ message: "Relación paciente-obstétrico/ginecológico no encontrada" });

    res.json({ pacienteOG, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar relación paciente-obstétrico/ginecológico", details: error });
  }
};

export const softDeletePacienteObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteObstetricosGinecologicosService.softDeletePacienteObstetricosGinecologicos(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación paciente-obstétrico/ginecológico no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación paciente-obstétrico/ginecológico", details: error });
  }
};

export const deletePacienteObstetricosGinecologicos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteObstetricosGinecologicosService.deletePacienteObstetricosGinecologicos(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación paciente-obstétrico/ginecológico no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación paciente-obstétrico/ginecológico físicamente", details: error });
  }
};