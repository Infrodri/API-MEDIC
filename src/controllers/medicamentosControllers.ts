// src/controllers/medicamentosControllers.ts
import { MedicamentosRepository } from "@repositories/MedicamentosRepositories";
import { MedicamentosService } from "@services/MedicamentosService";
import { Request, Response } from "express";
import { IMedicamentosRepository, IMedicamentosService, Medicamentos } from "types/MedicamentosTypes";

const medicamentosRepository: IMedicamentosRepository = new MedicamentosRepository();
const medicamentosService: IMedicamentosService = new MedicamentosService(medicamentosRepository);

export const findMedicamentos = async (req: Request, res: Response) => {
  try {
    const medicamentos = await medicamentosService.findMedicamentos();
    const basicInfoList = medicamentos.map((medicamento) => medicamento.getBasicInfo());

    res.status(200).json({
      medicamentos: basicInfoList,
      message: basicInfoList.length > 0 ? "Lista de medicamentos obtenida con éxito" : "No hay medicamentos registrados aún",
    });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener medicamentos", details: error });
  }
};

// Resto del código sin cambios
export const findMedicamentosById = async (req: Request, res: Response) => {
  try {
    const medicamento = await medicamentosService.findMedicamentosById(req.params.id);
    if (!medicamento) return res.status(404).json({ message: "Medicamento no encontrado" });

    res.json({ medicamento, message: "Medicamento encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener medicamento", details: error });
  }
};

export const createMedicamentos = async (req: Request, res: Response) => {
  try {
    const newMedicamento: Omit<Medicamentos, keyof Document> = req.body;
    const { medicamento, message } = await medicamentosService.createMedicamentos(newMedicamento);

    res.status(201).json({ medicamento, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear medicamento", details: error });
  }
};

export const updateMedicamentos = async (req: Request, res: Response) => {
  try {
    const { medicamento, message } = await medicamentosService.updateMedicamentos(req.params.id, req.body);
    if (!medicamento) return res.status(404).json({ message: "Medicamento no encontrado" });

    res.json({ medicamento, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar medicamento", details: error });
  }
};

export const softDeleteMedicamentos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await medicamentosService.softDeleteMedicamentos(req.params.id);
    if (!success) return res.status(404).json({ message: "Medicamento no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar medicamento", details: error });
  }
};

export const deleteMedicamentos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await medicamentosService.deleteMedicamentos(req.params.id);
    if (!success) return res.status(404).json({ message: "Medicamento no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar medicamento físicamente", details: error });
  }
};