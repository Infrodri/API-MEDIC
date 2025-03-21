// src/controllers/DashboardController.ts
import DashboardService from "@services/dashboardService";
import { Request, Response } from "express";



export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await DashboardService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
      message: "Estadísticas del dashboard obtenidas con éxito",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: errorMessage,
    });
  }
};

export const getConsultasPorMesPorEspecialidad = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string);
    const month = parseInt(req.query.month as string);

    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Parámetros 'year' y 'month' son requeridos y deben ser válidos (mes entre 1 y 12)",
      });
    }

    const data = await DashboardService.getConsultasPorMesPorEspecialidad(year, month);
    res.status(200).json({
      success: true,
      data,
      message: "Consultas por mes y especialidad obtenidas con éxito",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error in getConsultasPorMesPorEspecialidad:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener consultas por mes y especialidad",
      error: errorMessage,
    });
  }
};

export const getMedicosList = async (req: Request, res: Response) => {
  try {
    const medicos = await DashboardService.getMedicosList();
    res.status(200).json({
      success: true,
      data: medicos,
      message: "Lista de médicos obtenida con éxito",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error in getMedicosList:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener lista de médicos",
      error: errorMessage,
    });
  }
};

export const getConsultasHoy = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await DashboardService.getConsultasHoy(page, limit);
    res.status(200).json({
      success: true,
      data,
      message: "Consultas de hoy obtenidas con éxito",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error in getConsultasHoy:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener consultas de hoy",
      error: errorMessage,
    });
  }
};

export const getPacientesEnEspera = async (req: Request, res: Response) => {
  try {
    const pacientes = await DashboardService.getPacientesEnEspera();
    res.status(200).json({
      success: true,
      data: pacientes,
      message: "Pacientes en espera obtenidos con éxito",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error in getPacientesEnEspera:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pacientes en espera",
      error: errorMessage,
    });
  }
};
export const getConsultasPorMes = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await DashboardService.getConsultasPorMes(year);
    res.status(200).json({
      success: true,
      data,
      message: "Consultas por mes obtenidas con éxito",
    });
  } catch (error) {
    console.error("Error in getConsultasPorMes controller:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener consultas por mes",
      error: (error as Error).message,
    });
  }
};