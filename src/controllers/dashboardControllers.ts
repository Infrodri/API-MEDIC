// src/controllers/dashboardControllers.ts
import DashboardService from "@services/dashboardService";
import { BaseStats } from "@services/dashboardService";
import { Request, Response } from "express";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userRoles = req.currentUser?.roles || [];
    const isAdmin = Array.isArray(userRoles) && userRoles.some(role => typeof role === "string" ? role === "admin" : role.name === "admin");
    const isMedic = Array.isArray(userRoles) && userRoles.some(role => typeof role === "string" ? role === "medic" : role.name === "medic");
    const isUser = Array.isArray(userRoles) && userRoles.some(role => typeof role === "string" ? role === "user" : role.name === "user");

    const baseStats: BaseStats = await DashboardService.getBaseStats();
    const consultasPorMedico = await DashboardService.getConsultasPorMedico();

    let response: { [key: string]: any } = { ...baseStats, consultasPorMedico };

    if (isAdmin) {
      response = {
        ...baseStats,
        consultasPorMedico,
      };
    } else if (isMedic) {
      response = {
        totalConsultasHoy: baseStats.totalConsultasHoy,
        consultasPendientes: baseStats.consultasPendientes,
        consultasPorMedico,
      };
    } else if (isUser) {
      response = {
        totalConsultasHoy: baseStats.totalConsultasHoy,
        totalMedicosActivos: baseStats.totalMedicosActivos,
      };
    }

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ success: false, message: "Error al obtener estadísticas", error: String(error) });
  }
};

export const getConsultasHoy = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { consultas, total } = await DashboardService.getConsultasHoy(page, limit);

    const formattedConsultas = consultas.map((consulta: any) => ({
      id: consulta._id,
      paciente: `${consulta.paciente?.primerNombre || ""} ${consulta.paciente?.primerApellido || ""}`,
      medico: `${consulta.medico?.primerNombre || ""} ${consulta.medico?.primerApellido || ""}`,
      fecha: consulta.fecha,
      estado: consulta.estadoConsulta,
    }));

    res.status(200).json({
      success: true,
      data: { consultas: formattedConsultas, total, page, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error in getConsultasHoy:", error);
    res.status(500).json({ success: false, message: "Error al obtener consultas del día", error: String(error) });
  }
};

export const getMedicosActivosHoy = async (req: Request, res: Response) => {
  try {
    const formattedMedicos = await DashboardService.getFormattedMedicosActivos();
    res.status(200).json({ success: true, data: formattedMedicos });
  } catch (error) {
    console.error("Error in getMedicosActivosHoy:", error);
    res.status(500).json({ success: false, message: "Error al obtener médicos activos", error: String(error) });
  }
};

export const getAlertas = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const alertas = await DashboardService.getAlertas(page, limit);
    res.status(200).json({ success: true, data: alertas });
  } catch (error) {
    console.error("Error in getAlertas:", error);
    res.status(500).json({ success: false, message: "Error al obtener alertas", error: String(error) });
  }
};

export const getUserDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await DashboardService.getUserStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getUserDashboardStats:", error);
    res.status(500).json({ success: false, message: "Error al obtener estadísticas de usuario", error: String(error) });
  }
};

export const getCriticalResources = async (req: Request, res: Response) => {
  try {
    const criticalResources = await DashboardService.getCriticalResources();
    res.status(200).json({ success: true, data: { criticalResources } });
  } catch (error) {
    console.error("Error in getCriticalResources:", error);
    res.status(500).json({ success: false, message: "Error al obtener recursos críticos", error: String(error) });
  }
};

// Nuevo controlador para médicos filtrados
export const getFilteredDoctors = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { doctors, total } = await DashboardService.getFilteredDoctors(query, page, limit);

    res.status(200).json({
      success: true,
      data: {
        doctors,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getFilteredDoctors:", error);
    res.status(500).json({ success: false, message: "Error al obtener médicos filtrados", error: String(error) });
  }
};

// Nuevo controlador para contar páginas
export const getDoctorsPageCount = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;

    const totalPages = await DashboardService.getDoctorsPageCount(query, limit);

    res.status(200).json({
      success: true,
      data: { totalPages },
    });
  } catch (error) {
    console.error("Error in getDoctorsPageCount:", error);
    res.status(500).json({ success: false, message: "Error al obtener el número de páginas", error: String(error) });
  }
};