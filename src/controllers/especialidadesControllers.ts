import { EspecialidadesRepository } from "@repositories/EspecialidadesRepositories";
import { EspecialidadesService } from "@services/EspecialidadesService";
import { Request, Response } from "express";
import { IEspecialidadesRepository, IEspecialidadesService, Especialidades } from "types/EspecialidadesTypes";

const especialidadesRepository: IEspecialidadesRepository = new EspecialidadesRepository();
const especialidadesService: IEspecialidadesService = new EspecialidadesService(especialidadesRepository);

export const findEspecialidades = async (req: Request, res: Response) => {
  try {
    const especialidades = await especialidadesService.findEspecialidades();
    const basicInfoList = especialidades.map((especialidad) => especialidad.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay especialidades encontradas." });

    res.json({ especialidades: basicInfoList, message: "Lista de especialidades obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener especialidades", details: error });
  }
};

export const findEspecialidadesById = async (req: Request, res: Response) => {
  try {
    const especialidad = await especialidadesService.findEspecialidadesById(req.params.id);
    if (!especialidad) return res.status(404).json({ message: "Especialidad no encontrada" });

    res.json({ especialidad, message: "Especialidad encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener especialidad", details: error });
  }
};

export const createEspecialidades = async (req: Request, res: Response) => {
  try {
    const newEspecialidad: Omit<Especialidades, keyof Document> = req.body;
    const { especialidad, message } = await especialidadesService.createEspecialidades(newEspecialidad);

    res.status(201).json({ especialidad, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear especialidad", details: error });
  }
};

export const updateEspecialidades = async (req: Request, res: Response) => {
  try {
    const { especialidad, message } = await especialidadesService.updateEspecialidades(req.params.id, req.body);
    if (!especialidad) return res.status(404).json({ message: "Especialidad no encontrada" });

    res.json({ especialidad, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar especialidad", details: error });
  }
};

export const softDeleteEspecialidades = async (req: Request, res: Response) => {
  try {
    const { success, message } = await especialidadesService.softDeleteEspecialidades(req.params.id);
    if (!success) return res.status(404).json({ message: "Especialidad no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar especialidad", details: error });
  }
};

export const deleteEspecialidades = async (req: Request, res: Response) => {
  try {
    const { success, message } = await especialidadesService.deleteEspecialidades(req.params.id);
    if (!success) return res.status(404).json({ message: "Especialidad no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar especialidad físicamente", details: error });
  }
};