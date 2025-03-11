import { OrganosSentidosRepository } from "@repositories/OrganosSentidosRepository";
import { OrganosSentidosService } from "@services/OrganosSentidosService";
import { Request, Response } from "express";
import { IOrganosSentidosRepository, IOrganosSentidosService, OrganosSentidos } from "types/OrganosSentidosTypes";

const organosSentidosRepository: IOrganosSentidosRepository = new OrganosSentidosRepository();
const organosSentidosService: IOrganosSentidosService = new OrganosSentidosService(organosSentidosRepository);

export const findOrganosSentidos = async (req: Request, res: Response) => {
  try {
    const organos = await organosSentidosService.findOrganosSentidos();
    if (organos.length === 0) return res.status(404).json({ message: "No hay evaluaciones de órganos de sentidos encontradas." });
    res.json({ organos, message: "Lista de evaluaciones de órganos de sentidos obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener evaluaciones de órganos de sentidos", details: error });
  }
};

export const findOrganosSentidosById = async (req: Request, res: Response) => {
  try {
    const organo = await organosSentidosService.findOrganosSentidosById(req.params.id);
    if (!organo) return res.status(404).json({ message: "Evaluación de órganos de sentidos no encontrada" });
    res.json({ organo, message: "Evaluación de órganos de sentidos encontrada con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener evaluación de órganos de sentidos", details: error });
  }
};

export const createOrganosSentidos = async (req: Request, res: Response) => {
  try {
    const newOrgano: Omit<OrganosSentidos, keyof Document> = req.body;
    const { organo, message } = await organosSentidosService.createOrganosSentidos(newOrgano);
    res.status(201).json({ organo, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear evaluación de órganos de sentidos", details: error });
  }
};

export const updateOrganosSentidos = async (req: Request, res: Response) => {
  try {
    const { organo, message } = await organosSentidosService.updateOrganosSentidos(req.params.id, req.body);
    if (!organo) return res.status(404).json({ message: "Evaluación de órganos de sentidos no encontrada" });
    res.json({ organo, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar evaluación de órganos de sentidos", details: error });
  }
};

export const softDeleteOrganosSentidos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await organosSentidosService.softDeleteOrganosSentidos(req.params.id);
    if (!success) return res.status(404).json({ message: "Evaluación de órganos de sentidos no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar evaluación de órganos de sentidos", details: error });
  }
};

export const deleteOrganosSentidos = async (req: Request, res: Response) => {
  try {
    const { success, message } = await organosSentidosService.deleteOrganosSentidos(req.params.id);
    if (!success) return res.status(404).json({ message: "Evaluación de órganos de sentidos no encontrada" });
    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar evaluación de órganos de sentidos físicamente", details: error });
  }
};