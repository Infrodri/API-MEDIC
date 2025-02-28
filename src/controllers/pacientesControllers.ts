import { PacienteRepository } from "@repositories/PacienteRepositories"; // Actualizado
import { PacienteService } from "@services/PacienteService"; // Actualizado
import { Request, Response } from "express";
import { IPacienteRepository, IPacienteService, Paciente } from "types/PacientesTypes";

const pacienteRepository: IPacienteRepository = new PacienteRepository();
const pacienteService: IPacienteService = new PacienteService(pacienteRepository);

export const findPacientes = async (req: Request, res: Response) => {
  try {
    const pacientes = await pacienteService.findPacientes();
    const basicInfoList = pacientes.map((paciente) => paciente.getBasicInfo());
    if (basicInfoList.length === 0) return res.status(404).json({ message: "No hay pacientes encontrados." });

    res.json({ pacientes: basicInfoList, message: "Lista de pacientes obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener pacientes", details: error });
  }
};

export const findPacienteById = async (req: Request, res: Response) => {
  try {
    const paciente = await pacienteService.findPacienteById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    res.json({ paciente, message: "Paciente encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener paciente", details: error });
  }
};

export const createPaciente = async (req: Request, res: Response) => {
  try {
    const newPaciente: Paciente = req.body;
    const { paciente, message } = await pacienteService.createPaciente(newPaciente);

    res.status(201).json({ paciente, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear paciente", details: error });
  }
};

export const updatePaciente = async (req: Request, res: Response) => {
  try {
    const { paciente, message } = await pacienteService.updatePaciente(req.params.id, req.body);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    res.json({ paciente, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar paciente", details: error });
  }
};

export const softDeletePaciente = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteService.softDeletePaciente(req.params.id);
    if (!success) return res.status(404).json({ message: "Paciente no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar paciente", details: error });
  }
};

export const deletePaciente = async (req: Request, res: Response) => {
  try {
    const { success, message } = await pacienteService.deletePaciente(req.params.id);
    if (!success) return res.status(404).json({ message: "Paciente no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar paciente físicamente", details: error });
  }
};
