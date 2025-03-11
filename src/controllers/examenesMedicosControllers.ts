// src/controllers/examenesMedicosControllers.ts
import { ExamenesMedicosRepository } from "@repositories/ExamenesMedicosRepositories";
import { ExamenesMedicosService } from "@services/ExamenesMedicosService";
import { Request, Response } from "express";
import { IExamenesMedicosRepository, IExamenesMedicosService, ExamenesMedicos } from "types/ExamenesMedicosTypes";

const examenesMedicosRepository: IExamenesMedicosRepository = new ExamenesMedicosRepository();
const examenesMedicosService: IExamenesMedicosService = new ExamenesMedicosService(examenesMedicosRepository);

export const findExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const examenes = await examenesMedicosService.findExamenesMedicos();
    const basicInfoList = examenes.map((examen) => examen.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay tipos de exámenes médicos encontrados." });

    res.json({ examenes: basicInfoList, message: "Lista de tipos de exámenes médicos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener tipos de exámenes médicos", details: error });
  }
};

// Resto de los métodos sin cambios significativos
export const findExamenesMedicosById = async (req: Request, res: Response) => {
  try {
    const examen = await examenesMedicosService.findExamenesMedicosById(req.params.id);
    if (!examen) return res.status(404).json({ message: "Tipo de examen médico no encontrado" });

    res.json({ examen: examen.getBasicInfo(), message: "Tipo de examen médico encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener tipo de examen médico", details: error });
  }
};

export const createExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const newExamen: Omit<ExamenesMedicos, keyof Document> = req.body;
    const { examen, message } = await examenesMedicosService.createExamenesMedicos(newExamen);

    res.status(201).json({ examen: examen.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear tipo de examen médico", details: error });
  }
};

export const updateExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const { examen, message } = await examenesMedicosService.updateExamenesMedicos(req.params.id, req.body);
    if (!examen) return res.status(404).json({ message: "Tipo de examen médico no encontrado" });

    res.json({ examen: examen.getBasicInfo(), message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar tipo de examen médico", details: error });
  }
};

export const softDeleteExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await examenesMedicosService.softDeleteExamenesMedicos(req.params.id);
    if (!success) return res.status(404).json({ message: "Tipo de examen médico no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar tipo de examen médico", details: error });
  }
};

export const deleteExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await examenesMedicosService.deleteExamenesMedicos(req.params.id);
    if (!success) return res.status(404).json({ message: "Tipo de examen médico no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar tipo de examen médico físicamente", details: error });
  }
};