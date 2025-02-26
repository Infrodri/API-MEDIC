import { RecetasMedicasRepository } from "@repositories/RecetasMedicasRepositories";
import { RecetasMedicasService } from "@services/RecetasMedicasService";
import { Request, Response } from "express";
import { IRecetasMedicasRepository, IRecetasMedicasService, RecetasMedicas } from "types/RecetasMedicasTypes";

const recetasMedicasRepository: IRecetasMedicasRepository = new RecetasMedicasRepository();
const recetasMedicasService: IRecetasMedicasService = new RecetasMedicasService(recetasMedicasRepository);

export const findRecetasMedicas = async (req: Request, res: Response) => {
  try {
    const recetas = await recetasMedicasService.findRecetasMedicas();
    const basicInfoList = recetas.map((receta) => receta.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay recetas médicas encontradas." });

    res.json({ recetas: basicInfoList, message: "Lista de recetas médicas obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener recetas médicas", details: error });
  }
};

export const findRecetasMedicasById = async (req: Request, res: Response) => {
  try {
    const receta = await recetasMedicasService.findRecetasMedicasById(req.params.id);
    if (!receta) return res.status(404).json({ message: "Receta médica no encontrada" });

    res.json({ receta, message: "Receta médica encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener receta médica", details: error });
  }
};

export const createRecetasMedicas = async (req: Request, res: Response) => {
  try {
    const newReceta: Omit<RecetasMedicas, keyof Document> = req.body;
    const { receta, message } = await recetasMedicasService.createRecetasMedicas(newReceta);

    res.status(201).json({ receta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear receta médica", details: error });
  }
};

export const updateRecetasMedicas = async (req: Request, res: Response) => {
  try {
    const { receta, message } = await recetasMedicasService.updateRecetasMedicas(req.params.id, req.body);
    if (!receta) return res.status(404).json({ message: "Receta médica no encontrada" });

    res.json({ receta, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar receta médica", details: error });
  }
};

export const softDeleteRecetasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await recetasMedicasService.softDeleteRecetasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Receta médica no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar receta médica", details: error });
  }
};

export const deleteRecetasMedicas = async (req: Request, res: Response) => {
  try {
    const { success, message } = await recetasMedicasService.deleteRecetasMedicas(req.params.id);
    if (!success) return res.status(404).json({ message: "Receta médica no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar receta médica físicamente", details: error });
  }
};