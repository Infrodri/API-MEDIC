import { RecetasMedicamentosRepository } from "@repositories/RecetasMedicamentosRepositories";
import { RecetasMedicamentosService } from "@services/RecetasMedicamentosService";
import { Request, Response } from "express";
import { IRecetasMedicamentosRepository, IRecetasMedicamentosService, RecetasMedicamentos } from "types/RecetasMedicamentosTypes";

const recetasMedicamentosRepository: IRecetasMedicamentosRepository = new RecetasMedicamentosRepository();
const recetasMedicamentosService: IRecetasMedicamentosService = new RecetasMedicamentosService(recetasMedicamentosRepository);

export const findRecetasMedicamentos = async (req: Request, res: Response) => {
  try {
    const recetasMedicamentos = await recetasMedicamentosService.findRecetasMedicamentos();
    const basicInfoList = recetasMedicamentos.map((recetaMedicamento) => recetaMedicamento.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay relaciones receta-medicamento encontradas." });

    res.json({ recetasMedicamentos: basicInfoList, message: "Lista de relaciones receta-medicamento obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relaciones receta-medicamento", details: error });
  }
};

export const findRecetasMedicamentosById = async (req: Request, res: Response) => {
  try {
    const recetaMedicamento = await recetasMedicamentosService.findRecetasMedicamentosById(req.params.id);
    if (!recetaMedicamento) return res.status(404).json({ message: "Relación receta-medicamento no encontrada" });

    res.json({ recetaMedicamento, message: "Relación receta-medicamento encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener relación receta-medicamento", details: error });
  }
};

export const createRecetasMedicamentos = async (req: Request, res: Response) => {
  try {
    const newRecetaMedicamento: Omit<RecetasMedicamentos, keyof Document> = req.body;
    const { recetaMedicamento, message } = await recetasMedicamentosService.createRecetasMedicamentos(newRecetaMedicamento);

    res.status(201).json({ recetaMedicamento, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear relación receta-medicamento", details: error });
  }
};

export const updateRecetasMedicamentos = async (req: Request, res: Response) => {
  try {
    const { recetaMedicamento, message } = await recetasMedicamentosService.updateRecetasMedicamentos(req.params.id, req.body);
    if (!recetaMedicamento) return res.status(404).json({ message: "Relación receta-medicamento no encontrada" });

    res.json({ recetaMedicamento, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar relación receta-medicamento", details: error });
  }
};

export const softDeleteRecetasMedicamentos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await recetasMedicamentosService.softDeleteRecetasMedicamentos(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación receta-medicamento no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación receta-medicamento", details: error });
  }
};

export const deleteRecetasMedicamentos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await recetasMedicamentosService.deleteRecetasMedicamentos(req.params.id);
    if (!success) return res.status(404).json({ message: "Relación receta-medicamento no encontrada" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar relación receta-medicamento físicamente", details: error });
  }
};