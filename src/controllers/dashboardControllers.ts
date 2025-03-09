// src/controllers/dashboardControllers.ts
import { Request, Response } from "express";
import { ConsultasMedicasModel } from "../models/ConsultasMedicas";
import { MedicoModel } from "../models/Medicos";
import { Medico } from "types/MedicoTypes";
import { Paciente } from "types/PacientesTypes";

// Helper para obtener el inicio y fin del día
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// 1. Estadísticas del Dashboard
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { start, end } = getTodayRange();
    const totalConsultasHoy = await ConsultasMedicasModel.countDocuments({ fecha: { $gte: start, $lte: end } });
    const consultasPendientes = await ConsultasMedicasModel.countDocuments({ estadoConsulta: "Pendiente" });
    const totalMedicosActivos = await MedicoModel.countDocuments({ estaActivo: true });

    res.status(200).json({
      totalConsultasHoy,
      consultasPendientes,
      totalMedicosActivos,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error });
  }
};

// 2. Consultas del día
export const getConsultasHoy = async (req: Request, res: Response) => {
  try {
    const { start, end } = getTodayRange();
    console.log("Rango de fechas:", start, end);

    const consultas = await ConsultasMedicasModel.find({ fecha: { $gte: start, $lte: end } })
      .populate("paciente", "primerNombre primerApellido")
      .populate("medico", "primerNombre primerApellido especialidades");

    console.log("Consultas encontradas:", consultas.length);
    if (consultas.length > 0) {
      console.log("Paciente ejemplo:", consultas[0].paciente);
      console.log("Médico ejemplo:", consultas[0].medico);
    }

    const formattedConsultas = consultas.map((consulta) => ({
      id: consulta._id,
      paciente: consulta.paciente
        ? `${consulta.paciente.primerNombre} ${consulta.paciente.primerApellido}`
        : "Paciente no encontrado",
      medico: consulta.medico
        ? `${consulta.medico.primerNombre} ${consulta.medico.primerApellido}`
        : "Médico no encontrado",
      hora: consulta.fecha instanceof Date ? consulta.fecha.toLocaleTimeString() : "Hora no válida",
      estado: consulta.estadoConsulta,
      prioridad: consulta.prioridad,
    }));

    res.status(200).json(formattedConsultas);
  } catch (error) {
    console.error("Error en getConsultasHoy:", error);
    res.status(500).json({ message: "Error al obtener consultas del día", error });
  }
};

// 3. Médicos activos
export const getMedicosActivosHoy = async (req: Request, res: Response) => {
  try {
    const medicos = await MedicoModel.find({ estaActivo: true })
      .populate("especialidades", "nombre");

    const formattedMedicos = medicos.map((medico) => ({
      id: medico._id,
      nombre: `${medico.primerNombre} ${medico.primerApellido}`,
      especialidad: medico.especialidades.map((esp: any) => esp.nombre),
    }));

    res.status(200).json(formattedMedicos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener médicos activos", error });
  }
};

// 4. Alertas
export const getAlertas = async (req: Request, res: Response) => {
  try {
    const consultasUrgentes = await ConsultasMedicasModel.find({ prioridad: "Urgente", estadoConsulta: "Pendiente" })
      .populate("paciente", "primerNombre primerApellido");

    const alertas = consultasUrgentes.map((consulta) => {
      const paciente = consulta.paciente;
      const nombreCompleto = paciente 
        ? `${paciente.primerNombre || ''} ${paciente.primerApellido || ''}`.trim() 
        : 'Paciente desconocido';
      return {
        tipo: "consulta_urgente",
        mensaje: `Consulta urgente para ${nombreCompleto}`,
        consultaId: consulta._id,
      };
    });

    res.status(200).json(alertas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener alertas", error });
  }
};