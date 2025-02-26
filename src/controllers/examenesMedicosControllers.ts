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
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay exámenes médicos encontrados." });

    res.json({ examenes: basicInfoList, message: "Lista de exámenes médicos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener exámenes médicos", details: error });
  }
};

export const findExamenesMedicosById = async (req: Request, res: Response) => {
  try {
    const examen = await examenesMedicosService.findExamenesMedicosById(req.params.id);
    if (!examen) return res.status(404).json({ message: "Examen médico no encontrado" });

    res.json({ examen, message: "Examen médico encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener examen médico", details: error });
  }
};

export const createExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const newExamen: Omit<ExamenesMedicos, keyof Document> = req.body;
    const { examen, message } = await examenesMedicosService.createExamenesMedicos(newExamen);

    res.status(201).json({ examen, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear examen médico", details: error });
  }
};

export const updateExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const { examen, message } = await examenesMedicosService.updateExamenesMedicos(req.params.id, req.body);
    if (!examen) return res.status(404).json({ message: "Examen médico no encontrado" });

    res.json({ examen, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar examen médico", details: error });
  }
};

export const softDeleteExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await examenesMedicosService.softDeleteExamenesMedicos(req.params.id);
    if (!success) return res.status(404).json({ message: "Examen médico no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar examen médico", details: error });
  }
};

export const deleteExamenesMedicos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await examenesMedicosService.deleteExamenesMedicos(req.params.id);
    if (!success) return res.status(404).json({ message: "Examen médico no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar examen médico físicamente", details: error });
  }
};