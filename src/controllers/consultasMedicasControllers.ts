import { ConsultasMedicasRepository } from "@repositories/ConsultasMedicasRepositories";
import { ConsultasMedicasService } from "@services/ConsultasMedicasService";
import { Request, Response } from "express";
import { IConsultasMedicasRepository, IConsultasMedicasService, ConsultasMedicas } from "types/ConsultasMedicasTypes";

const consultasMedicasRepository: IConsultasMedicasRepository = new ConsultasMedicasRepository();
const consultasMedicasService: IConsultasMedicasService = new ConsultasMedicasService(consultasMedicasRepository);

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

export const deleteConsultasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await consultasMedicasService.deleteConsultasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Consulta médica no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar consulta médica físicamente", details: error });
  }
};