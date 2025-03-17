import { Request, Response } from "express";
import DashboardService from "@services/dashboardService";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const baseStats = await DashboardService.getBaseStats();
    const consultasPorMes = await DashboardService.getConsultasPorMes();
    const consultasPorMedico = await DashboardService.getConsultasPorMedico();
    const consultasPorPacienteEstado = await DashboardService.getConsultasPorPacienteEstado();

    const response = {
      ...baseStats,
      consultasPorMes,
      consultasPorMedico,
      consultasPorPacienteEstado,
    };

    res.status(200).json({
      success: true,
      data: response,
      message: "Estadísticas obtenidas con éxito",
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas del dashboard",
      error: String(error),
    });
  }
};

export const getConsultasHoy = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { consultas, total, page: currentPage, totalPages } = await DashboardService.getConsultasHoy(page, limit);

    const formattedConsultas = consultas.map((consulta: any) => ({
      id: consulta._id,
      paciente: `${consulta.paciente?.nombre || ""} ${consulta.paciente?.apellido || ""}`,
      medico: `${consulta.medico?.primerNombre || ""} ${consulta.medico?.primerApellido || ""}`,
      fecha: consulta.fecha,
      estado: consulta.estado,
      pacienteImagen: `https://ui-avatars.com/api/?name=${consulta.paciente?.nombre}+${consulta.paciente?.apellido}`,
    }));

    res.status(200).json({
      success: true,
      data: { consultas: formattedConsultas, total, page: currentPage, totalPages },
      message: "Consultas del día obtenidas con éxito",
    });
  } catch (error) {
    console.error("Error in getConsultasHoy:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener consultas del día",
      error: String(error),
    });
  }
};

export const getMedicosActivosHoy = async (req: Request, res: Response) => {
  try {
    const medicosActivos = await DashboardService.getFormattedMedicosActivos();
    res.status(200).json({
      success: true,
      data: medicosActivos,
      message: "Médicos activos obtenidos con éxito",
    });
  } catch (error) {
    console.error("Error in getMedicosActivosHoy:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener médicos activos",
      error: String(error),
    });
  }
};

export const getPacientes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { pacientes, total, page: currentPage, totalPages } = await DashboardService.getPacientes(page, limit);

    res.status(200).json({
      success: true,
      data: { pacientes, total, page: currentPage, totalPages },
      message: "Pacientes obtenidos con éxito",
    });
  } catch (error) {
    console.error("Error in getPacientes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pacientes",
      error: String(error),
    });
  }
};